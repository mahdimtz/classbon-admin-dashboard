import logo from "@assets/images/logo.svg";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, redirect, useActionData, useNavigate, useNavigation, useRouteError, useSubmit } from "react-router-dom";
import { httpService } from "@core/http-service"
import { useTranslation } from "react-i18next";
const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors,},
  } = useForm();

  const submitForm = useSubmit(); // این امکان را میده که فرم را دستی سابمیت کنید
  const {t} = useTranslation()
  const onSubmit = (data) => {
    const {confirmPassword, ...userData} = data; // witch rest oparator confirm password has ignore
    submitForm(userData, {method: 'post'});
  } 
  const navigation = useNavigation();
  // use navigation =>  کل فرایند روتینگ اینکه در هر لحظه در چه وضعیتی هستیم را رصد میکند
  // سه وضعیت=> idle , submiting , loading
  //idle =>  در یک پیج هستیم
  //submiting => در حال سابمیت به فرم هستیم 
  const isSubmitting = navigation.state !== 'idle';

  const routeErrors = useRouteError();
  //useRouteError => برای مدیریت خطا
  // که از ریجستر اکشن میاد
  const isSuccessOperation = useActionData(); 
  // useActionData() => چیزی که میده مقداریه که از registerAction
  // return میشود
  
  const navigate = useNavigate(); //redirect

  useEffect(() => {
    if (isSuccessOperation) {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [isSuccessOperation])

  return (
    <>
      <div className="text-center mt-4">
        <img src={logo} style={{ height: "100px" }} />
        <h1 className="h2">{t('register.title')}</h1>
        <p className="lead">
          {t('register.introMessage')}
        </p>
        <p className="lead">
          {t('register.alreadyRegistered')}
          &nbsp;
          <Link to="/login" className="me-2">
           {t('register.signin')}
          </Link>
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="m-sm-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">{t('register.mobile')}</label>
                <input
                  {...register("mobile", {
                    required: true,
                    minLength: 11,
                    maxLength: 11
                  })}
                  className={`form-control form-control-lg ${
                    errors.mobile && "is-invalid"
                  }`}
                />
                {errors.mobile && errors.mobile.type === "required" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t('register.validation.mobileRequired')}
                  </p>
                )}
                {errors.mobile && (errors.mobile.type === "minLength" || errors.mobile.type === 'maxLength') && (
                  <p className="text-danger small fw-bolder mt-1">
                   {t('register.validation.mobileLength')}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">{t('register.password')}</label>
                <input
                  {...register("password", { required:  true })}
                  className={`form-control form-control-lg ${
                    errors.password && "is-invalid"
                  }`}
                  type="password"
                />
                {errors.password && (errors.password.type === 'required') &&(
                  <p className="text-danger small fw-bolder mt-1">
                    {t('register.validation.passwordRequired')}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">{t('register.repeatPassword')}</label>
                <input
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => {
                      if (watch("password") !== value) {
                        return t('register.validation.notMatching');
                      }
                    },
                  })}
                  className={`form-control form-control-lg ${
                    errors.confirmPassword && "is-invalid"
                  }`}
                  type="password"
                />
                {errors.confirmPassword &&
                  errors.confirmPassword.type === "required" && (
                    <p className="text-danger small fw-bolder mt-1">
                      {t('register.validation.repeatPasswordRequired')}
                    </p>
                  )}
                {errors.confirmPassword &&
                  errors.confirmPassword.type === "validate" && (
                    <p className="text-danger small fw-bolder mt-1">
                      {errors.confirmPassword?.message}
                    </p>
                  )}
              </div>
              <div className="text-center mt-3">
                <button type="submit" disabled={isSubmitting} className="btn btn-lg btn-primary">
                  {isSubmitting ? t('register.saving') : t('register.register')}
                </button>
              </div>
              {
            routeErrors && (
              <div className="alert alert-danger text-danger p-2 mt-3">
                {routeErrors.response?.data.map(error => <p className="mb-0">{t(`register.validation.${error.code}`)}</p>)}
              </div>
            )
          }
          {
            isSuccessOperation && (
              <div className="alert alert-success text-success p-2 mt-3">
                {t('register.successOperation')}
              </div>
            )
          }
            </form>
          </div>
        </div>
      </div>
    </>
  );
};


export default Register;

// registerAction هیچ ارتباطی با کامپوننت رجیستر ندارد 
// ارتباط اینها را ریکت روتر دام دارد برقرار میکند
// با خصوصیت اکشن که در روتر تعریف شده داره اتفاق می افتد
export async function registerAction({request}) {
  const formData = await request.formData();// با متد فرم دیتا اطلاعاتی که کاربر در فرم وارد کرده به صورت کی ولیو ذخیره میشود
  const data = Object.fromEntries(formData); //برای اینکه مقادیر فرم دیتا را به صورت ابجکت کنیم
  // Object.fromEntries => کارش اینکه convert key:value => {object}
  const response = await httpService.post('/Users', data);
  return response.status === 200;
}