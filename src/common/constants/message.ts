export const MESSAGE = {
  //auth
  ACCOUNT_REGISTER_SUCCESS: 'auth.account_register_success',
  ACCOUNT_LOGIN_FAILED: 'auth.account_login_failed',
  ACCOUNT_NOT_EXISTED: 'auth.account_not_existed',
  ACCOUNT_CONFIRMED: 'auth.account_confirmed',
  ACCOUNT_VERIFY_FAILED: 'auth.account_verify_failed',
  ACCOUNT_NOT_ACTIVATED: 'auth.account_not_activated',
  ACCOUNT_RESET_PASSWORD_FAILED: 'auth.account_reset_password_failed',
  FORBIDDEN: 'auth.forbidden ',
  ACCOUNT_INCORRECT_PASSWORD: 'auth.account_incorrect_password',
  ACCOUNT_CHANGE_PASSWORD_SUCCESS: 'auth.account_change_password_success',
  ACCOUNT_CHANGE_PASSWORD_FAILED: 'auth.account_change_password_failed',
  ACCOUNT_LOCKED: 'auth.account_locked',
  ACCOUNT_INACTIVE: 'auth.account_inactive',

  //token
  INVALID_OR_EXPIRED_TOKEN: 'token.invalid_or_expired_token',

  //user
  USER_NOT_FOUND: 'user.user_notfound',
  EMAIL_EXISTED: 'user.email_existed',
  EMAIL_NOT_EXIST: 'user.email_not_exist',
  UPDATE_USER_SUCCESS: 'user.update_success',
  UPDATE_USER_FAIL: 'user.update_user_failed',
  SOFT_DELETE_SUCCESS: 'user.soft_delete_user_success',
  SOFT_DELETE_FAIL: 'user.soft_delete_user_fail',
  HARD_DELETE_USER_SUCCESS: 'user.hard_delete_success',
  HARD_DELETE_USER_FAIL: 'user.hard_delete_fail',
};
// mail footer
export const MAIL_FOOTER = (language: string) => {
  const footers: Record<string, string> = {
    vi: `
      Trân trọng, <br><br>
      FixoraGo <br>`,
    en: `
      Best regards, <br><br>
      FixoraGo <br>`,
    ja: `
      敬具, <br><br>
      FixoraGo <br>`,
  };

  return footers[language] || '';
};

export const CONFIRM_REGISTER = (
  language: string,
  fullName: string,
  confirm_url: string,
) => {
  const titles: Record<string, string> = {
    vi: 'Xác thực tài khoản',
    en: 'Account Verification',
    ja: 'アカウント認証',
  };
  const content: Record<string, string> = {
    vi: `
      Xin chào <strong>${fullName},</strong><br><br>
      Cảm ơn bạn đã quan tâm và đăng ký tài khoản sử dụng <strong>FixoraGo - Giải pháp toàn diện cho thiết kế CAD ở trên web.</strong><br>
      Để xác minh địa chỉ email của bạn, vui lòng nhấn vào liên kết sau đây:<br>
      <a href="${confirm_url}" target="_blank">Link xác thực</a><br><br>
      Liên kết này có hiệu lực trong vòng 15 phút. Nếu bạn không nhấn vào liên kết trong thời gian này, bạn sẽ phải yêu cầu xác thực lại.<br><br>
      Sau khi nhấn vào liên kết trên, tài khoản của bạn sẽ được xác thực và bạn có thể bắt đầu sử dụng.<br><br>
      ${MAIL_FOOTER(language)}
    `,
    en: `
      Hello <strong>${fullName}</strong>,<br><br> 
      Thank you for using InWEB - a comprehensive solution for CAD design on the web.<br> 
      To verify your email address, please click the link below:<br> 
      <a href="${confirm_url}" target="_blank">Verification Link</a><br><br> 
      This link is valid for 15 minutes. If you do not click the link within this time, you will need to request re-verification.<br><br> 
      Once you click the link, your account will be verified, and you can begin using it.<br><br>
      ${MAIL_FOOTER(language)}
    `,
    ja: `
      こんにちは <strong>${fullName}</strong> 様,<br><br>
      InWEB - Web上でのCAD設計のための包括的ソリューションをご利用いただきありがとうございます。<br>
      メールアドレスの確認のため、以下のリンクをクリックしてください：<br>
      <a href="${confirm_url}" target="_blank">認証リンク</a><br><br>
      このリンクは15分間有効です。この時間内にリンクをクリックしなかった場合、再認証をリクエストする必要があります。<br><br>
      リンクをクリック後、アカウントが認証され、利用を開始することができます。<br><br>
      ${MAIL_FOOTER(language)}
    `,
  };

  return { titles: titles[language] || '', content: content[language] || '' };
};
