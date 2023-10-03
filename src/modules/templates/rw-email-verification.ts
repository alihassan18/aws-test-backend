export const rwConfirmationEmail = (userId, token, domain, firstName) => {
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Mintstargram | Email Confirmation</title>
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @font-face {
          font-family: "proxima_novabold";
          src: url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_bold-webfont.woff2")
              format("woff2"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_bold-webfont.woff")
              format("woff"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_bold-webfont.ttf")
              format("truetype");
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: "proxima_novaextrabold";
          src: url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_extrabold-webfont.woff2")
              format("woff2"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_extrabold-webfont.woff")
              format("woff"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_extrabold-webfont.ttf")
              format("truetype");
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: "proxima_novaregular";
          src: url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_font-webfont.woff2")
              format("woff2"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_font-webfont.woff")
              format("woff"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_font-webfont.ttf")
              format("truetype");
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: "proxima_novalight";
          src: url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_light-webfont.woff2")
              format("woff2"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_light-webfont.woff")
              format("woff"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_light-webfont.ttf")
              format("truetype");
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: "proxima_novasemibold";
          src: url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_semibold-webfont.woff2")
              format("woff2"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_semibold-webfont.woff")
              format("woff"),
            url("https://socket.mintstargram.com/emails/fonts/proxima/proxima_nova_semibold-webfont.ttf")
              format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      </style>
    </head>
    <body
      style="
        margin: 0;
        font-family: 'proxima_novaregular', Arial, Helvetica, sans-serif;
      "
    >
      <div
        style="
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: center;
          background: #fff;
        "
      >
        <div
          style="
            max-width: 640px;
            margin: 30px auto;
            background: #14141f;
            overflow: hidden;
            width: 100%;
            position: relative;
          "
        >
          <div
            style="
              width: 100%;
              max-width: 545px;
              float: left;
              padding: 40px 0;
              margin: 0 48px;
              -moz-box-sizing: border-box;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              border-bottom: 1px solid #efc74d;
            "
          >
            <strong style="float: left; width: 95px; height: 39px">
              <a href="javascript:void(0);" style="display: block">
                <img
                  src="http://res.cloudinary.com/dq3jqnrem/image/upload/v1687869424/xddy7kmh1gcoh8wvawpw.png"
                  alt=""
                  style="width: 100%; height: 100%; display: block"
                />
              </a>
            </strong>
          </div>
          <div
            style="
              width: 100%;
              float: left;
              padding: 36px 48px 24px;
              text-align: center;
              -moz-box-sizing: border-box;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
            "
          >
            <div style="width: 100%; float: left">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  line-height: 33px;
                  font-weight: 700;
                  color: #fff;
                  text-align: center;
                "
              >
                Email Verification
              </h1>
              <p
                style="
                  margin: 5px 0 0;
                  font-size: 18px;
                  font-weight: 400;
                  line-height: 27px;
                  font-weight: 600;
                  color: #fff;
                "
              >
                Hello, ${firstName}
              </p>
              <p
                style="
                  margin: 14px 0 0;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 24px;
                  color: #fff;
                "
              >
              To ensure you never miss important intel, verify your email address now.As a special thank you for verifying, you’ll get a 2$MR Tokens in-game digital items for RuffyWorld ®. Plus, you’ll get the latest news on RuffyWorld in-game events, special in-game offers, seasonal giveaways and more.
              </p>
            </div>
            <div
              style="
                width: 100%;
                float: left;
                text-align: center;
                margin-top: 40px;
              "
            >
              <a
                href=${`${domain}/?userId=${userId}&&token=${token}`}
                style="
                  margin: 0;
                  line-height: 64px;
                  min-width: 198px;
                  display: inline-block;
                  vertical-align: top;
                  border-radius: 52px;
                  color: #14141f;
                  font-weight: 700;
                  font-size: 20px;
                  background: #efc74d;
                  text-decoration: none;
                  overflow: hidden;
                "
                >Verify your Email</a
              >
            </div>
            <div style="width: 100%; float: left; margin: 56px 0 0">
              <ul
                style="
                  display: inline-block;
                  vertical-align: middle;
                  list-style: none;
                  padding: 0;
                  margin: 0;
                "
              >
                <li
                  style="
                    display: inline-block;
                    padding: 0 8px;
                    list-style-type: none;
                  "
                >
                  <a href="https://discord.com/invite/Mintstargram" style="display: block">
                    <img
                      src="https://socket.mintstargram.com/emails/images/social-icons/discord.png"
                      alt=""
                      style="width: 100%; height: 100%; display: block"
                    />
                  </a>
                </li>
                <li
                  style="
                    display: inline-block;
                    padding: 0 8px;
                    list-style-type: none;
                  "
                >
                  <a href="https://twitter.com/mintstargram_com" style="display: block">
                    <img
                      src="https://socket.mintstargram.com/emails/images/social-icons/twitter.png"
                      alt=""
                      style="width: 100%; height: 100%; display: block"
                    />
                  </a>
                </li>
                <li
                  style="
                    display: inline-block;
                    padding: 0 8px;
                    list-style-type: none;
                  "
                >
                  <a href="https://telegram.com/mintstargram_com" style="display: block">
                    <img
                      src="https://socket.mintstargram.com/emails/images/social-icons/telegram.png"
                      alt=""
                      style="width: 100%; height: 100%; display: block"
                    />
                  </a>
                </li>
              </ul>
            </div>
            <div style="width: 100%; float: left; margin: 12px 0 0">
              <p
                style="
                  margin: 0;
                  font-size: 16px;
                  line-height: 26px;
                  color: #818182;
                  font-weight: 400;
                "
              >
                2023 © RuffyWorld. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};
