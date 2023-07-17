
function getGoogleUrl() { // function for builing url to login
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: "http://localhost:8000/login/oauth/google", // my url for handling response from google consent screen  
    client_id: "154547488983-p6dttq0f1vuqg2tvct35n272um7vod07.apps.googleusercontent.com",
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(" "),
  }

  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

export default getGoogleUrl;