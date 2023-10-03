export const invitation_mintstargram = (username, code) => {
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
        <title>Mintstargram | Like</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * {
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          body {
            font: 400 15px/24px "Roboto", Helvetica, Arial, "sans-serif";
          }
          @font-face {
            font-family: "proxima_novabold";
            src: url("https://mintstargram-git-develop-meta-ruffy.vercel.app/assets/fonts/ProximaNova-Bold.woff2")
              format("woff2");
            font-weight: 700;
            font-style: normal;
          }
          @font-face {
            font-family: "proxima_novaregular";
            src: url("https://mintstargram-git-develop-meta-ruffy.vercel.app/assets/fonts/ProximaNova-Regular.woff2")
              format("woff2");
            font-weight: 400;
            font-style: normal;
          }
          p {
            font-size: 16px;
            font-weight: 400;
            color: #bfbfbf;
          }
          h6 {
            font-family: "proxima_novaregular";
            color: #727279;
            font-size: 16px;
            font-weight: 400;
          }
          @media (max-width: 768px) {
            h3 {
              font-size: 20px !important;
              line-height: 20px !important;
              margin-bottom: 5px !important;
            }
            /* .at-mintstargramimg{width: 100% !important; height: auto !important;} */
          }
        </style>
      </head>
      <body style="margin: 0; font-family: 'proxima_novaregular'">
        <div style="overflow: hidden; display: flex; background: #fff">
          <div
            style="
              max-width: 640px;
              margin: 30px auto;
              background: #202327;
              overflow: hidden;
              width: 100%;
              padding: 40px 48px;
              position: relative;
            "
          >
            <div
              style="
                width: 100%;
                padding-bottom: 20px;
                border-bottom: 1px solid #5c5c63;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
              "
            >
              <!-- src="https://mintstargram-git-develop-meta-ruffy.vercel.app/assets/images/mail-logo.svg" -->
    
              <a href="javascript:void(0);" style="display: block">
                <img
                  src="https://dev.mintstargram.com/assets/images/logo.svg"
    
    
                  alt=""
                />
                
              </a>
            </div>
    
            <div
              style="
                background: #18191e;
                width: 100%;
                float: left;
                padding: 40px;
                border-radius: 8px;
                margin-top: 16px;
              "
            >
              <h1
                style="
                  margin: 0;
                  font-family: 'proxima_novabold';
                  font-size: 24px;
                  margin-bottom: 24px;
                  color: #fff;
                  text-align:  center;
                "
              >
              You have new invitations
              </h1>
              <div style="text-align:  center;">
              
    
                <p style=" color: #727279; 
                  
                ">You have been invited by <span style="color: #f1c94a;">
                    ${username}
                </span>  to join mintstargram.com</p>
    
                <a href="javascript:void(0);" style="display: block ;text-align: center;  margin-top: 20px;">
                  <img
                    src="https://dev.mintstargram.com/assets/images/logo.svg"
                    alt=""
                  />
                  
                </a>
            
              
              <p  style=" color: #727279;  text-align: center;  margin-top: 20px; 
               cursor: pointer">
                                                 Code <span  style="color: #f1c94a; font-family: proxima_novabold">
                                                     ${code}
                                                 </span> 
    
              </p>
             
              <a href="mintstargram.com" style="display: block;text-decoration:none">
              <p  style=" color: #f1c94a;  text-align: center; font-size: 12px; margin-top: 20px; text-decoration:none;
              font-family: proxima_novabold; cursor: pointer">Go to Mintstargram.com</p>
                
              </a>
                 
           
            </div>
    
           
          </div>
           <div style="width: 100%; float: left">
              <h6 style="margin-top: 24px">
               This email was automatically generated by the system. Do not reply to this email.-
              </h6>
              <h6 style="margin-top: 24px">FZCO based in Dubai</h6>
              <h6>© 2023 Mintstargram</h6>
            </div>
        </div>
      </body>
    </html>
    `;
};
