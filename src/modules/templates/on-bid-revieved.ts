export const onBidPlaced = (
    title: string,
    image: string,
    url: string
) => `<!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8" />
          <meta
                name="viewport"
                content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
            />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Mintstargram | Bid on Nft</title>
          <meta name="description" content="" />
          <!-- <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
          /> -->
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
      <body style="margin: 0; font-family: 'proxima_novaregular', Arial, Helvetica, sans-serif;">
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
              <div style="
              max-width: 640px;
              margin: 30px auto;
              background: #14141f;
              overflow: hidden;
              width: 100%;
              position: relative;">
                  <div
                      style="
                          width: 100%;
                          background: #14141f;
                          padding-top: 18px;
                          overflow: hidden;
                          padding-bottom: 24px;
                          -moz-box-sizing: border-box;
                          -webkit-box-sizing: border-box;
                          box-sizing: border-box;
                      "
                  >
                      <strong style="float: left; width: 95px; height: 39px">
                          <a href="javascript:void(0);" style="display: block">
                              <img
                                  style="padding-left: 65px; padding-right: 28px"
                                  src="https://socket.mintstargram.com/emails/images/logo.png"
                                  alt=""
                                  style="width: 100%; height: 100%; display: block"
                              />
                          </a>
                      </strong>
                  </div>
                  <div
                      style="
                          width: 100%;
                          padding: 0 15px;
                          float: left;
                          -moz-box-sizing: border-box;
                          -webkit-box-sizing: border-box;
                          box-sizing: border-box;
                      "
                  >
                      <h3
                          style="
                              font-size: 38px;
                              line-height: 38px;
                              text-transform: uppercase;
                              color: white;
                              margin-top: 30px;
                              margin-bottom: 20px;
                              text-align: center;
                              font-family: proxima_novabold;
                              -moz-box-sizing: border-box;
                      -webkit-box-sizing: border-box;
                      box-sizing: border-box;
                          "
                      >
                          Whoops!
                      </h3>
                      <p
                          style="
                              font-size: 16px;
                              text-align: center;
                              font-family: proxima_novaregular;
                              color: #b8b8bc;
                              letter-spacing: 0.2px;
                          "
                      >
                          Someone bid more than your bid on ${title}.
                      </p>
  
                      <img
                          src=${
                              'https://mintstargram.infura-ipfs.io/ipfs/' +
                              image.split('/')[4]
                          }
                          class="at-mintstargramimg"
                          style="
                              margin: 0 auto;
                              display: block;
                              height: 202px;
                              width: 202px;
                          "
                      />
                      <a
                          href="${url}"
                          style="
                              text-align: center;
                              text-decoration: none;
                              background-color: #efc74d;
                              width: 198px;
                              height: 48px;
                              border: none;
                              color: #14141f;
                              font-size: 16px;
                              border-radius: 52px;
                              margin: 20px auto 0;
                              clear: both;
                              display: block;
                              line-height: 48px;
                              font-family: proxima_novabold;
                              font-weight: 700;
                          "
                      >
                          View Bid
                      </a>
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
                                  href="https://discord.com/invite/Mintstargram"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/discord.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              <a
                                  href="https://twitter.com/mintstargram_com"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/twitter.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              <a
                                  href="https://telegram.com/mintstargram_com"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/telegram.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              "
                          >
                              Mintstargram
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
                              FAQ
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
                              Whitepaper
                          </li>
                      </ul>
                      <p
                          style="
                          color: #fff;
                              text-align: center;
                              margin-top: 43px;
                              margin-bottom: 20px;
                              font-family: proxima_novaregular;
                          "
                      >
                          © Copyright 2022 Mintstargram
                      </p>
                  </div>
              </div>
          </div>
          
      </body>
  </html>`;

export const onBidRecieved = (
    title: string,
    image: string,
    url: string
) => `<!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8" />
          <meta
                name="viewport"
                content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
            />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Mintstargram | Bid on Nft</title>
          <meta name="description" content="" />
          <!-- <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
          /> -->
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
      <body style="margin: 0; font-family: 'proxima_novaregular', Arial, Helvetica, sans-serif;">
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
              <div style="
              max-width: 640px;
              margin: 30px auto;
              background: #14141f;
              overflow: hidden;
              width: 100%;
              position: relative;">
                  <div
                      style="
                          width: 100%;
                          background: #14141f;
                          padding-top: 18px;
                          overflow: hidden;
                          padding-bottom: 24px;
                          -moz-box-sizing: border-box;
                          -webkit-box-sizing: border-box;
                          box-sizing: border-box;
                      "
                  >
                      <strong style="float: left; width: 95px; height: 39px">
                          <a href="javascript:void(0);" style="display: block">
                              <img
                                  style="padding-left: 65px; padding-right: 28px"
                                  src="https://socket.mintstargram.com/emails/images/logo.png"
                                  alt=""
                                  style="width: 100%; height: 100%; display: block"
                              />
                          </a>
                      </strong>
                  </div>
                  <div
                      style="
                          width: 100%;
                          padding: 0 15px;
                          float: left;
                          -moz-box-sizing: border-box;
                          -webkit-box-sizing: border-box;
                          box-sizing: border-box;
                      "
                  >
                      <h3
                          style="
                              font-size: 38px;
                              line-height: 38px;
                              text-transform: uppercase;
                              color: white;
                              margin-top: 30px;
                              margin-bottom: 20px;
                              text-align: center;
                              font-family: proxima_novabold;
                              -moz-box-sizing: border-box;
                      -webkit-box-sizing: border-box;
                      box-sizing: border-box;
                          "
                      >
                          Bidding Alert!
                      </h3>
                      <p
                          style="
                              font-size: 16px;
                              text-align: center;
                              font-family: proxima_novaregular;
                              color: #b8b8bc;
                              letter-spacing: 0.2px;
                          "
                      >
                          Someone bid on your listing ${title}.
                      </p>
  
                      <img
                          src=${
                              'https://mintstargram.infura-ipfs.io/ipfs/' +
                              image.split('/')[4]
                          }
                          class="at-mintstargramimg"
                          style="
                              margin: 0 auto;
                              display: block;
                              height: 202px;
                              width: 202px;
                          "
                      />
                      <a
                          href="${url}"
                          style="
                              text-align: center;
                              text-decoration: none;
                              background-color: #efc74d;
                              width: 198px;
                              height: 48px;
                              border: none;
                              color: #14141f;
                              font-size: 16px;
                              border-radius: 52px;
                              margin: 20px auto 0;
                              clear: both;
                              display: block;
                              line-height: 48px;
                              font-family: proxima_novabold;
                              font-weight: 700;
                          "
                      >
                          View Bid
                      </a>
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
                                  href="https://discord.com/invite/Mintstargram"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/discord.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              <a
                                  href="https://twitter.com/mintstargram_com"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/twitter.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              <a
                                  href="https://telegram.com/mintstargram_com"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/telegram.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              "
                          >
                              Mintstargram
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
                              FAQ
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
                              Whitepaper
                          </li>
                      </ul>
                      <p
                          style="
                          color: #fff;
                              text-align: center;
                              margin-top: 43px;
                              margin-bottom: 20px;
                              font-family: proxima_novaregular;
                          "
                      >
                          © Copyright 2022 Mintstargram
                      </p>
                  </div>
              </div>
          </div>
          
      </body>
  </html>`;

export const onBoughtNFT = (
    title: string,
    price: number,
    currency: string,
    image: string
) => `<!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8" />
          <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Mintstargram | Congratulations</title>
          <meta name="description" content="" />
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
      <body  style="margin: 0; font-family: 'proxima_novaregular', Arial, Helvetica, sans-serif;">
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
              <header
                  style="
                      width: 100%;
                      background: #14141f;
                      padding-top: 18px;
                      padding-bottom: 24px;
                      -moz-box-sizing: border-box;
                      -webkit-box-sizing: border-box;
                      box-sizing: border-box;
                  "
              >
                  <strong style="float: left; width: 95px; height: 39px">
                      <a href="javascript:void(0);" style="display: block">
                          <img
                              style="padding-left: 65px; padding-right: 28px"
                              src="https://socket.mintstargram.com/emails/images/logo.png"
                              alt=""
                              style="width: 100%; height: 100%; display: block"
                          />
                      </a>
                  </strong>
              </header>
              <div
                  style="
                      width: 100%;
                      padding: 0 15px;
                      -moz-box-sizing: border-box;
                      -webkit-box-sizing: border-box;
                      box-sizing: border-box;
                  "
              >
                  <h3
                      style="
                          font-size: 38px;
                          line-height: 38px;
                          text-transform: uppercase;
                          color: white;
                          margin-top: 30px;
                          margin-bottom: 20px;
                          text-align: center;
                          font-family: proxima_novabold;
                      "
                  >
                      Congratulations!
                  </h3>
                  <p
                      style="
                          font-size: 16px;
                          text-align: center;
                          font-family: proxima_novaregular;
                          color: #b8b8bc;
                          letter-spacing: 0.2px;
                      "
                  >
                      You successfully bought ${title} for ${Number(
    price + (1 / 100) * price
).toFixed()}
                    ${currency}
                  </p>
                  <img
                  src=${
                      'https://mintstargram.infura-ipfs.io/ipfs/' +
                      image.split('/')[4]
                  }
                      class="at-mintstargramimg"
                      style="
                          margin: 0 auto;
                          display: block;
                          height: 202px;
                          width: 202px;
                      "
                  />
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
                                  href="https://discord.com/invite/Mintstargram"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/discord.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              <a
                                  href="https://twitter.com/mintstargram_com"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/twitter.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              <a
                                  href="https://telegram.com/mintstargram_com"
                                  style="display: block"
                              >
                                  <img
                                      src="https://socket.mintstargram.com/emails/images/social-icons/telegram.png"
                                      alt=""
                                      style="
                                          width: 100%;
                                          height: 100%;
                                          display: block;
                                      "
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
                              "
                          >
                              Mintstargram
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
                              FAQ
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
                              Whitepaper
                          </li>
                      </ul>
                  <p
                      style="
                      color: #fff;
                          text-align: center;
                          margin-top: 43px;
                          margin-bottom: 20px;
                          font-family: proxima_novaregular;
                      "
                  >
                      © Copyright 2022 Mintstargram
                  </p>
              </div>
          </div>
      </body>
  </html>`;

export const onSoldNFT = (
    title: string,
    price: number,
    currency: string,
    image: string
) => `<!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8" />
          <meta
              name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
          />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Mintstargram | NFT Sold</title>
          <meta name="description" content="" />
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
      <body style="margin: 0; font-family: 'proxima_novaregular', Arial, Helvetica, sans-serif;">
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
              <header
                  style="
                      width: 100%;
                      background: #14141f;
                      padding-top: 18px;
                      padding-bottom: 24px;
                      -moz-box-sizing: border-box;
                      -webkit-box-sizing: border-box;
                      box-sizing: border-box;
                  "
              >
                  <strong style="float: left; width: 95px; height: 39px">
                      <a href="javascript:void(0);" style="display: block">
                          <img
                              style="padding-left: 65px; padding-right: 28px"
                              src="https://socket.mintstargram.com/emails/images/logo.png"
                              alt=""
                              style="width: 100%; height: 100%; display: block"
                          />
                      </a>
                  </strong>
              </header>
              <div
                  style="
                      width: 100%;
                      padding: 0 15px;
                      -moz-box-sizing: border-box;
                      -webkit-box-sizing: border-box;
                      box-sizing: border-box;
                  "
              >
                  <h3
                      style="
                          font-size: 38px;
                          line-height: 38px;
                          text-transform: uppercase;
                          color: white;
                          margin-top: 30px;
                          margin-bottom: 20px;
                          text-align: center;
                          font-family: proxima_novabold;
                      "
                  >
                      Congratulations!
                  </h3>
                  <p
                      style="
                          font-size: 16px;
                          text-align: center;
                          font-family: proxima_novaregular;
                          color: #b8b8bc;
                          letter-spacing: 0.2px;
                      "
                  >
                      You successfully sold your NFT ${title} for ${Number(
    Number(price + (1 / 100) * price).toFixed()
).toLocaleString()} ${currency}
                  </p>
                  <img
                  src=${
                      'https://mintstargram.infura-ipfs.io/ipfs/' +
                      image.split('/')[4]
                  }
                      class="at-mintstargramimg"
                      style="
                          margin: 0 auto;
                          display: block;
                          height: 202px;
                          width: 202px;
                      "
                  />
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
                          href="https://discord.com/invite/Mintstargram"
                          style="display: block"
                      >
                          <img
                              src="https://socket.mintstargram.com/emails/images/social-icons/discord.png"
                              alt=""
                              style="
                                  width: 100%;
                                  height: 100%;
                                  display: block;
                              "
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
                      <a
                          href="https://twitter.com/mintstargram_com"
                          style="display: block"
                      >
                          <img
                              src="https://socket.mintstargram.com/emails/images/social-icons/twitter.png"
                              alt=""
                              style="
                                  width: 100%;
                                  height: 100%;
                                  display: block;
                              "
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
                      <a
                          href="https://telegram.com/mintstargram_com"
                          style="display: block"
                      >
                          <img
                              src="https://socket.mintstargram.com/emails/images/social-icons/telegram.png"
                              alt=""
                              style="
                                  width: 100%;
                                  height: 100%;
                                  display: block;
                              "
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
                      "
                  >
                      <a
                          href="https://Mintstargram.io"
                          style="
                              display: block;
                              color: white;
                              text-decoration: none;
                          "
                          target="_blank"
                      >
                          Mintstargram
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
                          href="https://docs.Mintstargram.io/Mintstargram-and-mintstargram-docs/mintstargram/faq-mintstargram"
                          style="
                              display: block;
                              color: white;
                              text-decoration: none;
                          "
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
                          href="https://Mintstargram.io/wp-content/uploads/2022/09/Mintstargram_Whitepaper_ETH_FINAL-1.pdf"
                          style="
                              display: block;
                              color: white;
                              text-decoration: none;
                          "
                          target="_blank"
                      >
                          Whitepaper</a
                      >
                  </li>
              </ul>
                  <p
                      style="
                      color: #fff;
                          text-align: center;
                          margin-top: 43px;
                          margin-bottom: 20px;
                          font-family: proxima_novaregular;
                      "
                  >
                      © Copyright 2023 Mintstargram
                  </p>
              </div>
          </div>
      </body>
  </html>`;
