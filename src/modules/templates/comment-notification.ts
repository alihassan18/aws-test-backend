export const commentNotification = (
    displayName: string,
    profile: string,
    url: string,
    comment: string,
    createdAt: string
) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Mintstartgram | comment</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * {
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
          body {
            font: 400 15px/24px "Roboto", Helvetica, Arial, "sans-serif";
          }
          @font-face {
            font-family: "proxima_novabold";
            src: url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_bold-webfont.woff2")
                format("woff2"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_bold-webfont.woff")
                format("woff"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_bold-webfont.ttf")
                format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: "proxima_novaextrabold";
            src: url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_extrabold-webfont.woff2")
                format("woff2"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_extrabold-webfont.woff")
                format("woff"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_extrabold-webfont.ttf")
                format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: "proxima_novaregular";
            src: url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_font-webfont.woff2")
                format("woff2"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_font-webfont.woff")
                format("woff"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_font-webfont.ttf")
                format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: "proxima_novalight";
            src: url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_light-webfont.woff2")
                format("woff2"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_light-webfont.woff")
                format("woff"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_light-webfont.ttf")
                format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: "proxima_novasemibold";
            src: url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_semibold-webfont.woff2")
                format("woff2"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_semibold-webfont.woff")
                format("woff"),
              url("https://socket.mintstartgram.com/emails/fonts/proxima/proxima_nova_semibold-webfont.ttf")
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
            display: flex;
    
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
                margin: 0 48px;
                padding-top: 40px;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
              "
            >
              <strong style="float: left; width: 78px; height: 32px">
                <a href="javascript:void(0);" style="display: block">
                  <img
                    src="https://socket.mintstartgram.com/emails/images/logo.png"
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
                    font-size: 28px;
                    line-height: 34px;
                    font-weight: 600;
                    color: #fff;
                    text-align: center;
                  "
                >
                  ${displayName} mentioned you in a <br />
                  comment.
                </h1>
              </div>
              <div
                style="
                  width: 100%;
                  text-align: left;
                  margin-top: 28px;
                  border: 1px solid #d3d3d3;
                  border-radius: 15px;
                  overflow: hidden;
                  float: left;
                 
                "
              >
                <div
                  style="
                    background-color: #efc74d;
                    padding: 12px 20px;
                    height: 77px;
                   
                  "
                >
                <div >
                  <img
                    src=${profile}
                    class="at-mintstartgramimg"
                    style="
                      height: 50px;
                      width: 50px;
                      border-radius: 100%;
                      float: left;
    
                    "
                  />
    
                  <div  style="float: left; margin-left: 11px;" >
                    <h3
                      style="
                        font-weight: 600;
                        font-size: 18px;
                        color: #1f1f1f;
                        margin-top: 5px;
                      "
                    >
                      ${displayName}
                    </h3>
                    <p
                      style="
                        font-weight: 400;
                        font-size: 14px;
                        margin-top: -20px;
    
    
                        color: #43434c;
                      "
                    >
                      ${createdAt}
                    </p>
                  </div>
                </div>
               
              </div>
              <p
              style="
                font-weight: 400;
                font-size: 16px;
                line-height: 22px;
                color: #ffffff;
                clear: both;
                margin-left: 20px;
              "
            >
             ${comment}
            </p>
        </div>
    
              <a
              href=${url}
                style="
                  background-color: #efc74d;
                  width: 198px;
                  height: 45px;
                  border: none;
                  color: #14141f;
                  font-size: 16px;
                  border-radius: 52px;
                  margin-top: 32px;
                  font-family: proxima_novabold;
                  font-weight: 700;
                "
              >
                View Comment
    </a>
              <div style="width: 100%; float: left">
                <ul
                  style="
                    width: 100%;
                    list-style: none;
                    text-align: center;
                    padding: 0;
                    margin-top: 48px;
                  "
                >
                  <li
                    style="
                      display: inline-block;
                      padding: 0 8px;
                      list-style-type: none;
                    "
                  >
                    <a
                      href="https://discord.com/invite/Mintstartgram"
                      style="display: block"
                    >
                      <img
                        src="https://socket.mintstartgram.com/emails/images/social-icons/discord.png"
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
                    <a href="https://twitter.com/mintstartgram_com" style="display: block">
                      <img
                        src="https://socket.mintstartgram.com/emails/images/social-icons/twitter.png"
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
                    <a href="" style="display: block">
                      <img
                        src="https://socket.mintstartgram.com/emails/images/social-icons/reddit.png"
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
                    <a href="https://telegram.com/mintstartgram_com" style="display: block">
                      <img
                        src="https://socket.mintstartgram.com/emails/images/social-icons/telegram.png"
                        alt=""
                        style="width: 100%; height: 100%; display: block"
                      />
                    </a>
                  </li>
                  <li
                    style="
                      color: #fff;
                      padding: 0 8px;
                      display: inline-block;
                      list-style-type: none;
                      font-family: proxima_novaregular;
                      opacity: 0.8;
                      margin-left: 12%;
                    "
                  >
                    <a
                      href="https://Mintstartgram.io"
                      style="display: block; color: white; text-decoration: none"
                      target="_blank"
                    >
                      Mintstartgram
                    </a>
                  </li>
                  <li
                    style="
                      color: #fff;
                      padding: 0 8px;
                      display: inline-block;
                      list-style-type: none;
                      font-family: proxima_novaregular;
                      opacity: 0.8;
                    "
                  >
                    <a
                      href="https://docs.Mintstartgram.io/Mintstartgram-and-mintstartgram-docs/mintstartgram/faq-mintstartgram"
                      style="display: block; color: white; text-decoration: none"
                      target="_blank"
                    >
                      FAQ
                    </a>
                  </li>
                  <li
                    style="
                      color: #fff;
                      padding: 0 8px;
                      display: inline-block;
                      list-style-type: none;
                      font-family: proxima_novaregular;
                      opacity: 0.8;
                    "
                  >
                    <a
                      href="https://Mintstartgram.io/wp-content/uploads/2022/09/Mintstartgram_Whitepaper_ETH_FINAL-1.pdf"
                      style="display: block; color: white; text-decoration: none"
                      target="_blank"
                    >
                      Whitepaper</a
                    >
                  </li>
                </ul>
              </div>
              <div style="width: 100%; float: left; margin: 12px 0 0">
                <p
                  style="
                    margin: 0;
                    font-size: 16px;
                    line-height: 26px;
                    color: #fff;
                    font-weight: 400;
                  "
                >
                  © 2023 Mintstartgram
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
    
    `;
};
