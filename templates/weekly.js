export default function weeklyHTML(lists) {
  var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
  var nextWeek = new Date(
    new Date().setUTCHours(0, 0, 0, 0) + 60000 * 60 * 24 * 7
  );
  const month1 = today.toLocaleString("default", { month: "short" });
  const month2 = nextWeek.toLocaleString("default", { month: "short" });
  const day1 = today.getDate() + 1;
  const day2 = nextWeek.getDate();
  const title = `Upcoming releases<br/>${
    month1 === month2
      ? `${day1}&nbsp;-&nbsp;${day2}&nbsp;${month1}`
      : `${day1}&nbsp;${month1}&nbsp;- ${day2}&nbsp;${month2}`
  }`;

  const top = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
  >
  <head>
    <!--[if gte mso 9
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:AllowPNG /><o:PixelsPerInch
            >96</o:PixelsPerInch
          ></o:OfficeDocumentSettings
        ></xml
      ><!
    [endif]-->
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width" name="viewport" />
    <!--[if !mso]><!-->
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Roboto"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto+Slab"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Oswald"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }

      table,
      td,
      tr {
        vertical-align: top;
        border-collapse: collapse;
      }

      * {
        line-height: inherit;
      }

      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }
    </style>
    <style id="media-query" type="text/css">
      @media (max-width: 620px) {
        .block-grid,
        .col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }

        .block-grid {
          width: 100% !important;
        }

        .col {
          width: 100% !important;
        }

        .col_cont {
          margin: 0 auto;
        }

        img.fullwidth,
        img.fullwidthOnMobile {
          width: 100% !important;
        }

        .no-stack .col {
          min-width: 0 !important;
          display: table-cell !important;
        }

        .no-stack.two-up .col {
          width: 50% !important;
        }

        .no-stack .col.num2 {
          width: 16.6% !important;
        }

        .no-stack .col.num3 {
          width: 25% !important;
        }

        .no-stack .col.num4 {
          width: 33% !important;
        }

        .no-stack .col.num5 {
          width: 41.6% !important;
        }

        .no-stack .col.num6 {
          width: 50% !important;
        }

        .no-stack .col.num7 {
          width: 58.3% !important;
        }

        .no-stack .col.num8 {
          width: 66.6% !important;
        }

        .no-stack .col.num9 {
          width: 75% !important;
        }

        .no-stack .col.num10 {
          width: 83.3% !important;
        }

        .video-block {
          max-width: none !important;
        }

        .mobile_hide {
          min-height: 0px;
          max-height: 0px;
          max-width: 0px;
          display: none;
          overflow: hidden;
          font-size: 0px;
        }

        .desktop_hide {
          display: block !important;
          max-height: none !important;
        }
      }
    </style>
    <style id="menu-media-query" type="text/css">
      @media (max-width: 620px) {
        .menu-checkbox[type="checkbox"] ~ .menu-links {
          display: none !important;
          padding: 5px 0;
        }

        .menu-checkbox[type="checkbox"] ~ .menu-links span.sep {
          display: none;
        }

        .menu-checkbox[type="checkbox"]:checked ~ .menu-links,
        .menu-checkbox[type="checkbox"] ~ .menu-trigger {
          display: block !important;
          max-width: none !important;
          max-height: none !important;
          font-size: inherit !important;
        }

        .menu-checkbox[type="checkbox"] ~ .menu-links > a,
        .menu-checkbox[type="checkbox"] ~ .menu-links > span.label {
          display: block !important;
          text-align: center;
        }

        .menu-checkbox[type="checkbox"]:checked ~ .menu-trigger .menu-close {
          display: block !important;
        }

        .menu-checkbox[type="checkbox"]:checked ~ .menu-trigger .menu-open {
          display: none !important;
        }

        #menu6jn2bt ~ div label {
          border-radius: 0% !important;
        }

        #menu6jn2bt:checked ~ .menu-links {
          background-color: #000000 !important;
        }

        #menu6jn2bt:checked ~ .menu-links a {
          color: #ffffff !important;
        }

        #menu6jn2bt:checked ~ .menu-links span {
          color: #ffffff !important;
        }
      }
    </style>
    <style id="icon-media-query" type="text/css">
      @media (max-width: 620px) {
        .icons-inner {
          text-align: center;
        }

        .icons-inner td {
          margin: 0 auto;
        }
      }
    </style>
  </head>
  <body
    class="clean-body"
    style="
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      background-color: #f8d070;
    "
  >
    <!--[if IE]><div class="ie-browser"><![endif]-->
    <table
      bgcolor="#f8d070"
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      style="
        table-layout: fixed;
        vertical-align: top;
        min-width: 320px;
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
        background-color: #f8d070;
        background-image: url('https://mywatchlists.watch/popcorn.png');
        background-position: center top;
        background-repeat: repeat;
      "
      valign="top"
      width="100%"
    >
      <tbody>
        <tr style="vertical-align: top" valign="top">
          <td style="word-break: break-word; vertical-align: top" valign="top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f8d070"><![endif]-->
            <div style="background-color: #f8d070">
              <div
                class="block-grid"
                style="
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  margin: 0 auto;
                  background-color: transparent;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    background-color: transparent;
                    background-image: url('https://mywatchlists.watch/top.png');
                    background-position: top left;
                    background-repeat: repeat;
                  "
                >
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                  <div
                    class="col num12"
                    style="
                      min-width: 320px;
                      max-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                      width: 600px;
                    "
                  >
                    <div class="col_cont" style="width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                          border-right: 0px solid transparent;
                          padding-top: 0px;
                          padding-bottom: 0px;
                          padding-right: 0px;
                          padding-left: 0px;
                        "
                      >
                        <!--<![endif]-->
                        <div
                          style="
                            font-size: 16px;
                            text-align: center;
                            font-family: Trebuchet MS, Lucida Grande,
                              Lucida Sans Unicode, Lucida Sans, Tahoma,
                              sans-serif;
                          "
                        >
                          <div style="height: 60px"></div>
                        </div>
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
            <div>
              <div
                class="block-grid three-up"
                style="
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  margin: 0 auto;
                  background-color: #fff;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    background-color: #fff;
                  "
                >
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
                  <!--[if (mso)|(IE)]><td align="center" width="150" style="background-color:#fff;width:150px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:20px; padding-bottom:5px;"><![endif]-->
                  <div
                    class="col num3"
                    style="
                      display: table-cell;
                      vertical-align: top;
                      max-width: 320px;
                      min-width: 150px;
                      width: 150px;
                    "
                  >
                    <div class="col_cont" style="width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                          border-right: 0px solid transparent;
                          padding-top: 20px;
                          padding-bottom: 5px;
                          padding-right: 5px;
                          padding-left: 5px;
                        "
                      >
                        <!--<![endif]-->
                        <div
                          align="center"
                          class="img-container center fixedwidth"
                          style="padding-right: 0px; padding-left: 0px"
                        >
                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><!
                          [endif]--><a
                            href="https://mywatchlists.watch"
                            style="outline: none"
                            tabindex="-1"
                            target="_blank"
                            ><img
                              align="center"
                              border="0"
                              class="center fixedwidth"
                              src="https://mywatchlists.watch/logo.png"
                              style="
                                text-decoration: none;
                                -ms-interpolation-mode: bicubic;
                                height: auto;
                                border: 0;
                                width: 84px;
                                max-width: 100%;
                                display: block;
                              "
                              width="84"
                          /></a>
                          <!--[if mso]></td></tr></table><![endif]-->
                        </div>
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  <!--[if (mso)|(IE)]></td><td align="center" width="350" style="background-color:#fff;width:350px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                  <div
                    class="col num7"
                    style="
                      display: table-cell;
                      vertical-align: top;
                      max-width: 320px;
                      min-width: 350px;
                      width: 350px;
                    "
                  >
                    <div class="col_cont" style="width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                          border-right: 0px solid transparent;
                          padding-top: 5px;
                          padding-bottom: 5px;
                          padding-right: 5px;
                          padding-left: 5px;
                        "
                      >
                        <!--<![endif]-->
                        <div class="mobile_hide">
                          <div
                            style="
                              font-size: 16px;
                              text-align: center;
                              font-family: Trebuchet MS, Lucida Grande,
                                Lucida Sans Unicode, Lucida Sans, Tahoma,
                                sans-serif;
                            "
                          >
                            <div style="height: 25px"></div>
                          </div>
                        </div>
                        <div
                          align="center"
                          class="img-container center autowidth"
                          style="padding-right: 0px; padding-left: 0px"
                        >
                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><!
                          [endif]--><a
                          href="https://mywatchlists.watch"
                          style="outline: none"
                          tabindex="-1"
                          target="_blank"
                          ><img
                            align="center"
                            border="0"
                            class="center autowidth"
                            src="https://mywatchlists.watch/title.png"
                            style="
                              text-decoration: none;
                              -ms-interpolation-mode: bicubic;
                              height: auto;
                              border: 0;
                              width: 340px;
                              max-width: 100%;
                              display: block;
                            "
                            width="340"
                          /></a>
                          <!--[if mso]></td></tr></table><![endif]-->
                        </div>
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  <!--[if (mso)|(IE)]></td><td align="center" width="100" style="background-color:#fff;width:100px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                  <div
                    class="col num2"
                    style="
                      display: table-cell;
                      vertical-align: top;
                      max-width: 320px;
                      min-width: 100px;
                      width: 100px;
                    "
                  >
                    <div class="col_cont" style="width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                          border-right: 0px solid transparent;
                          padding-top: 0px;
                          padding-bottom: 0px;
                          padding-right: 0px;
                          padding-left: 0px;
                        "
                      >
                        <!--<![endif]-->
                        <div class="mobile_hide">
                          <div
                            style="
                              font-size: 16px;
                              text-align: center;
                              font-family: Trebuchet MS, Lucida Grande,
                                Lucida Sans Unicode, Lucida Sans, Tahoma,
                                sans-serif;
                            "
                          >
                            <div style="height: 20px"></div>
                          </div>
                        </div>
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
            <div>
              <div
                class="block-grid"
                style="
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  margin: 0 auto;
                  background-color: #fff;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    background-color: #fff;
                  "
                >
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#fff;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                  <div
                    class="col num12"
                    style="
                      min-width: 320px;
                      max-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                      width: 600px;
                    "
                  >
                    <div class="col_cont" style="width: 100% !important">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                          border-right: 0px solid transparent;
                          padding-top: 5px;
                          padding-bottom: 5px;
                          padding-right: 5px;
                          padding-left: 5px;
                        "
                      >
                        <!--<![endif]-->
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="divider"
                          role="presentation"
                          style="
                            table-layout: fixed;
                            vertical-align: top;
                            border-spacing: 0;
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            min-width: 100%;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                          "
                          valign="top"
                          width="100%"
                        >
                          <tbody>
                            <tr style="vertical-align: top" valign="top">
                              <td
                                class="divider_inner"
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  min-width: 100%;
                                  -ms-text-size-adjust: 100%;
                                  -webkit-text-size-adjust: 100%;
                                  padding-top: 15px;
                                  padding-right: 10px;
                                  padding-bottom: 15px;
                                  padding-left: 10px;
                                "
                                valign="top"
                              >
                                <table
                                  align="center"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="divider_content"
                                  role="presentation"
                                  style="
                                    table-layout: fixed;
                                    vertical-align: top;
                                    border-spacing: 0;
                                    border-collapse: collapse;
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-top: 2px dotted #5d5d5d;
                                    width: 100%;
                                  "
                                  valign="top"
                                  width="100%"
                                >
                                  <tbody>
                                    <tr
                                      style="vertical-align: top"
                                      valign="top"
                                    >
                                      <td
                                        style="
                                          word-break: break-word;
                                          vertical-align: top;
                                          -ms-text-size-adjust: 100%;
                                          -webkit-text-size-adjust: 100%;
                                        "
                                        valign="top"
                                      >
                                        <span></span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="
                            table-layout: fixed;
                            vertical-align: top;
                            border-spacing: 0;
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                          "
                          valign="top"
                          width="100%"
                        >
                          <tr style="vertical-align: top" valign="top">
                            <td
                              align="center"
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                padding-bottom: 0px;
                                padding-left: 0px;
                                padding-right: 0px;
                                padding-top: 0px;
                                text-align: center;
                                width: 100%;
                              "
                              valign="top"
                              width="100%"
                            >
                              <h2
                                style="
                                  color: #000;
                                  direction: ltr;
                                  font-family: Trebuchet MS, Lucida Grande,
                                    Lucida Sans Unicode, Lucida Sans, Tahoma,
                                    sans-serif;
                                  font-size: 22px;
                                  font-weight: normal;
                                  letter-spacing: normal;
                                  line-height: 150%;
                                  text-align: center;
                                  margin-top: 0;
                                  margin-bottom: 0;
                                "
                              >
                                ${title}
                              </h2>
                            </td>
                          </tr>
                        </table>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="divider"
                          role="presentation"
                          style="
                            table-layout: fixed;
                            vertical-align: top;
                            border-spacing: 0;
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            min-width: 100%;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                          "
                          valign="top"
                          width="100%"
                        >
                          <tbody>
                            <tr style="vertical-align: top" valign="top">
                              <td
                                class="divider_inner"
                                style="
                                  word-break: break-word;
                                  vertical-align: top;
                                  min-width: 100%;
                                  -ms-text-size-adjust: 100%;
                                  -webkit-text-size-adjust: 100%;
                                  padding-top: 15px;
                                  padding-right: 10px;
                                  padding-bottom: 15px;
                                  padding-left: 10px;
                                "
                                valign="top"
                              >
                                <table
                                  align="center"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="divider_content"
                                  role="presentation"
                                  style="
                                    table-layout: fixed;
                                    vertical-align: top;
                                    border-spacing: 0;
                                    border-collapse: collapse;
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-top: 2px dotted #5d5d5d;
                                    width: 100%;
                                  "
                                  valign="top"
                                  width="100%"
                                >
                                  <tbody>
                                    <tr
                                      style="vertical-align: top"
                                      valign="top"
                                    >
                                      <td
                                        style="
                                          word-break: break-word;
                                          vertical-align: top;
                                          -ms-text-size-adjust: 100%;
                                          -webkit-text-size-adjust: 100%;
                                        "
                                        valign="top"
                                      >
                                        <span></span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
            `;

  var middle = ``;
  for (const list of lists) {
    var movies = `
    <div style="background-color: transparent">
      <div
        class="block-grid"
        style="
          min-width: 320px;
          max-width: 600px;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          margin: 0 auto;
          background-color: #fff;
        "
      >
        <div
          style="
            border-collapse: collapse;
            display: table;
            width: 100%;
            background-color: #fff;
          "
        >
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#fff;width:600px; border-top: 0px solid #5D5D5D; border-left: 0px solid #5D5D5D; border-bottom: 0px dashed #5D5D5D; border-right: 0px solid #5D5D5D;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:5px; padding-bottom:10px;"><![endif]-->
          <div
            class="col num12"
            style="
              min-width: 320px;
              max-width: 600px;
              display: table-cell;
              vertical-align: top;
              width: 600px;
            "
          >
            <div class="col_cont" style="width: 100% !important">
              <!--[if (!mso)&(!IE)]><!-->
              <div
                style="
                  border-top: 0px solid #5d5d5d;
                  border-left: 0px solid #5d5d5d;
                  border-bottom: 0px dashed #5d5d5d;
                  border-right: 0px solid #5d5d5d;
                  padding-top: 5px;
                  padding-bottom: 10px;
                  padding-right: 5px;
                  padding-left: 5px;
                "
              >
                <!--<![endif]-->
                <table
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    table-layout: fixed;
                    vertical-align: top;
                    border-spacing: 0;
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                  "
                  valign="top"
                  width="100%"
                >
                  <tr style="vertical-align: top" valign="top">
                    <td
                      align="center"
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        padding-bottom: 0px;
                        padding-left: 0px;
                        padding-right: 0px;
                        padding-top: 0px;
                        text-align: center;
                        width: 100%;
                      "
                      valign="top"
                      width="100%"
                    >
                      <h3
                        style="
                          color: #000;
                          direction: ltr;
                          font-family: Trebuchet MS, Lucida Grande,
                            Lucida Sans Unicode, Lucida Sans, Tahoma,
                            sans-serif;
                          font-size: 19px;
                          text-transform: uppercase;
                          font-weight: normal;
                          letter-spacing: normal;
                          line-height: 150%;
                          text-align: center;
                          margin-top: 0;
                          margin-bottom: 0;
                        "
                      >
                        ${list.title}
                      </h3>
                    </td>
                  </tr>
                </table>
                <!--[if (!mso)&(!IE)]><!-->
              </div>
              <!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    `;

    for (const [index, movie] of list.movies.entries()) {
      movies += `
      <div>
        <div
          class="block-grid mixed-two-up no-stack"
          style="
            min-width: 320px;
            max-width: 600px;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            margin: 0 auto;
            background-color: #fff;
          "
        >
          <div
            style="
              border-collapse: collapse;
              display: table;
              width: 100%;
              background-color: #fff;
            "
          >
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
            <!--[if (mso)|(IE)]><td align="center" width="150" style="background-color:#fff;width:150px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 20px; padding-top:10px; padding-bottom:10px;"><![endif]-->
            <div
              class="col num3"
              style="
                display: table-cell;
                vertical-align: top;
                max-width: 320px;
                min-width: 150px;
                width: 150px;
              "
            >
              <div class="col_cont" style="width: 100% !important">
                <!--[if (!mso)&(!IE)]><!-->
                <div
                  style="
                    border-top: 0px solid transparent;
                    border-left: 0px solid transparent;
                    border-bottom: 0px solid transparent;
                    border-right: 0px solid transparent;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    padding-right: 0px;
                    padding-left: 20px;
                  "
                >
                  <!--<![endif]-->
                  <div
                    align="right"
                    class="img-container right fixedwidth"
                    style="padding-right: 0px; padding-left: 0px"
                  >
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="right"><!
                    [endif]--><a
                      href="https://www.imdb.com/title/${
                        movie.details?.external_ids?.imdb_id
                      }"
                      style="outline: none"
                      tabindex="-1"
                      target="_blank"
                      ><img
                        align="right"
                        border="0"
                        class="right fixedwidth"
                        src="https://image.tmdb.org/t/p/w200${
                          movie.poster_path
                        }"
                        style="
                          text-decoration: none;
                          -ms-interpolation-mode: bicubic;
                          height: auto;
                          border: 0;
                          width: 78px;
                          max-width: 100%;
                          float: none;
                          display: block;
                        "
                        width="78"
                    /></a>
                    <!--[if mso]></td></tr></table><![endif]-->
                  </div>
                  <!--[if (!mso)&(!IE)]><!-->
                </div>
                <!--<![endif]-->
              </div>
            </div>
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            <!--[if (mso)|(IE)]></td><td align="center" width="450" style="background-color:#fff;width:450px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top:5px; padding-bottom:5px;"><![endif]-->
            <div
              class="col num9"
              style="
                display: table-cell;
                vertical-align: top;
                max-width: 320px;
                min-width: 450px;
                width: 450px;
              "
            >
              <div class="col_cont" style="width: 100% !important">
                <!--[if (!mso)&(!IE)]><!-->
                <div
                  style="
                    border-top: 0px solid transparent;
                    border-left: 0px solid transparent;
                    border-bottom: 0px solid transparent;
                    border-right: 0px solid transparent;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-right: 20px;
                    padding-left: 20px;
                  "
                >
                  <!--<![endif]-->
                  <div class="mobile_hide">
                    <div
                      style="
                        font-size: 16px;
                        text-align: center;
                        font-family: Trebuchet MS, Lucida Grande,
                          Lucida Sans Unicode, Lucida Sans, Tahoma,
                          sans-serif;
                      "
                    >
                      <div style="height: 35px"></div>
                    </div>
                  </div>
                  <!--[if !mso]><!-->
                  <div
                    class="desktop_hide"
                    style="
                      mso-hide: all;
                      display: none;
                      max-height: 0px;
                      overflow: hidden;
                    "
                  >
                    <div
                      style="
                        font-size: 16px;
                        text-align: center;
                        font-family: Trebuchet MS, Lucida Grande,
                          Lucida Sans Unicode, Lucida Sans, Tahoma,
                          sans-serif;
                      "
                    >
                      <div style="height: 10px"></div>
                    </div>
                  </div>
                  <!--<![endif]-->
                  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Tahoma, sans-serif"><![endif]-->
                  <div
                    style="
                      color: #000;
                      font-family: Trebuchet MS, Lucida Grande,
                        Lucida Sans Unicode, Lucida Sans, Tahoma,
                        sans-serif;
                      line-height: 1.5;
                      padding-top: 0px;
                      padding-right: 0px;
                      padding-bottom: 0px;
                      padding-left: 0px;
                    "
                  >
                    <div
                      class="txtTinyMce-wrapper"
                      style="
                        font-size: 12px;
                        line-height: 1.5;
                        color: #000;
                        font-family: Trebuchet MS, Lucida Grande,
                          Lucida Sans Unicode, Lucida Sans, Tahoma,
                          sans-serif;
                        mso-line-height-alt: 18px;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          font-size: 17px;
                          line-height: 1.5;
                          word-break: break-word;
                          mso-line-height-alt: 27px;
                          margin-top: 0;
                          margin-bottom: 0;
                        "
                      >
                        <a
                          href="https://www.imdb.com/title/${
                            movie.details?.external_ids?.imdb_id
                          }"
                          rel="noopener"
                          style="text-decoration: none; color: #000"
                          target="_blank"
                          ><span style="font-size: 17px">
                          ${movie.title}${
        movie.media_type === "tv"
          ? `&nbsp;- S${movie.details?.next_episode_to_air?.season_number}&nbsp;E${movie.details?.next_episode_to_air?.episode_number}`
          : ""
      }
                          </span></a
                        >
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-size: 17px;
                          line-height: 1.5;
                          word-break: break-word;
                          mso-line-height-alt: 27px;
                          margin-top: 0;
                          margin-bottom: 0;
                        "
                      >
                        <span style="font-size: 17px">${
                          movie.release_date
                        }</span>
                      </p>
                    </div>
                  </div>
                  <!--[if mso]></td></tr></table><![endif]-->
                  <!--[if (!mso)&(!IE)]><!-->
                </div>
                <!--<![endif]-->
              </div>
            </div>
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
        `;
    }

    middle += movies;
  }

  const bottom = `
  <div>
    <div
      class="block-grid mixed-two-up no-stack"
      style="
        min-width: 320px;
        max-width: 600px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        margin: 0 auto;
        background-color: #fff;
      "
    >
      <div
        style="
          border-collapse: collapse;
          display: table;
          width: 100%;
          background-color: #fff;
        "
      >
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
        <!--[if (mso)|(IE)]></td><td align="center" width="450" style="background-color:#fff;width:450px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div
          class="col num9"
          style="
            display: table-cell;
            vertical-align: top;
            max-width: 320px;
            min-width: 450px;
            width: 450px;
          "
        >
          <div class="col_cont" style="width: 100% !important">
            <!--[if (!mso)&(!IE)]><!-->
            <div
              style="
                border-top: 0px solid transparent;
                border-left: 0px solid transparent;
                border-bottom: 0px solid transparent;
                border-right: 0px solid transparent;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-right: 20px;
                padding-left: 20px;
              "
            >
              <!--<![endif]-->
              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Tahoma, sans-serif"><![endif]-->
              <div
                style="
                  color: #000;
                  font-family: Trebuchet MS, Lucida Grande,
                    Lucida Sans Unicode, Lucida Sans, Tahoma,
                    sans-serif;
                  line-height: 1.5;
                  padding-top: 0px;
                  padding-right: 0px;
                  padding-bottom: 0px;
                  padding-left: 0px;
                "
              >
                <div
                  class="txtTinyMce-wrapper"
                  style="
                    font-size: 12px;
                    line-height: 1.5;
                    color: #000;
                    font-family: Trebuchet MS, Lucida Grande,
                      Lucida Sans Unicode, Lucida Sans, Tahoma,
                      sans-serif;
                    mso-line-height-alt: 18px;
                  "
                >
                  <p
                    style="
                      text-align: center;
                      margin: 0;
                      font-size: 17px;
                      line-height: 1.5;
                      word-break: break-word;
                      mso-line-height-alt: 27px;
                      margin-top: 15px;
                      margin-bottom: 0;
                    "
                  >
                    <span style="font-size: 17px">Enjoy! 🙂</span>
                  </p>
                </div>
              </div>
              <!--[if mso]></td></tr></table><![endif]-->
              <!--[if (!mso)&(!IE)]><!-->
            </div>
            <!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
  </div>
  <div>
    <div
      class="block-grid"
      style="
        min-width: 320px;
        max-width: 600px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        margin: 0 auto;
        background-color: #fff;
      "
    >
      <div
        style="
          border-collapse: collapse;
          display: table;
          width: 100%;
          background-color: #fff;
        "
      >
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#fff;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div
          class="col num12"
          style="
            min-width: 320px;
            max-width: 600px;
            display: table-cell;
            vertical-align: top;
            width: 600px;
          "
        >
          <div class="col_cont" style="width: 100% !important">
            <!--[if (!mso)&(!IE)]><!-->
            <div
              style="
                border-top: 0px solid transparent;
                border-left: 0px solid transparent;
                border-bottom: 0px solid transparent;
                border-right: 0px solid transparent;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-right: 5px;
                padding-left: 5px;
              "
            >
              <!--<![endif]-->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="divider"
                role="presentation"
                style="
                  table-layout: fixed;
                  vertical-align: top;
                  border-spacing: 0;
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  min-width: 100%;
                  -ms-text-size-adjust: 100%;
                  -webkit-text-size-adjust: 100%;
                "
                valign="top"
                width="100%"
              >
                <tbody>
                  <tr style="vertical-align: top" valign="top">
                    <td
                      class="divider_inner"
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        min-width: 100%;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        padding-top: 15px;
                        padding-right: 10px;
                        padding-bottom: 15px;
                        padding-left: 10px;
                      "
                      valign="top"
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="divider_content"
                        role="presentation"
                        style="
                          table-layout: fixed;
                          vertical-align: top;
                          border-spacing: 0;
                          border-collapse: collapse;
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-top: 2px dotted #5d5d5d;
                          width: 100%;
                        "
                        valign="top"
                        width="100%"
                      >
                        <tbody>
                          <tr
                            style="vertical-align: top"
                            valign="top"
                          >
                            <td
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                              "
                              valign="top"
                            >
                              <span></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  table-layout: fixed;
                  vertical-align: top;
                  border-spacing: 0;
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                "
                valign="top"
                width="100%"
              >
                <tr style="vertical-align: top" valign="top">
                  <td
                    align="center"
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      padding-top: 0px;
                      padding-bottom: 0px;
                      padding-left: 0px;
                      padding-right: 0px;
                      text-align: center;
                      font-size: 0px;
                    "
                    valign="top"
                  >
                    <div class="menu-links">
                      <!--[if mso]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
<tr>
<td style="padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:15px">
<!
                      [endif]--><a
                        href="https://mywatchlists.watch/lists"
                        style="
                          padding-top: 15px;
                          padding-bottom: 15px;
                          padding-left: 15px;
                          padding-right: 15px;
                          display: inline;
                          color: #999;
                          font-family: Trebuchet MS, Lucida Grande,
                            Lucida Sans Unicode, Lucida Sans, Tahoma,
                            sans-serif;
                          font-size: 14px;
                          text-decoration: none;
                          letter-spacing: undefined;
                        "
                        >Lists</a
                      >
                      <!--[if mso]></td><td style="padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:15px"><!
                      [endif]--><a
                        href="https://mywatchlists.watch/account"
                        style="
                          padding-top: 15px;
                          padding-bottom: 15px;
                          padding-left: 15px;
                          padding-right: 15px;
                          display: inline;
                          color: #999;
                          font-family: Trebuchet MS, Lucida Grande,
                            Lucida Sans Unicode, Lucida Sans, Tahoma,
                            sans-serif;
                          font-size: 14px;
                          text-decoration: none;
                          letter-spacing: undefined;
                        "
                        >Account</a
                      >
                      <!--[if mso]></td><td style="padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:15px"><!
                      [endif]--><a
                        href="https://mywatchlists.watch/privacy"
                        style="
                          padding-top: 15px;
                          padding-bottom: 15px;
                          padding-left: 15px;
                          padding-right: 15px;
                          display: inline;
                          color: #999;
                          font-family: Trebuchet MS, Lucida Grande,
                            Lucida Sans Unicode, Lucida Sans, Tahoma,
                            sans-serif;
                          font-size: 14px;
                          text-decoration: none;
                          letter-spacing: undefined;
                        "
                        >Privacy&nbsp;Notice</a
                      >
                      <!--[if mso]></td></tr></table><![endif]-->
                    </div>
                  </td>
                </tr>
              </table>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="divider"
                role="presentation"
                style="
                  table-layout: fixed;
                  vertical-align: top;
                  border-spacing: 0;
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  min-width: 100%;
                  -ms-text-size-adjust: 100%;
                  -webkit-text-size-adjust: 100%;
                "
                valign="top"
                width="100%"
              >
                <tbody>
                  <tr style="vertical-align: top" valign="top">
                    <td
                      class="divider_inner"
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        min-width: 100%;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        padding-top: 15px;
                        padding-right: 10px;
                        padding-bottom: 15px;
                        padding-left: 10px;
                      "
                      valign="top"
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="divider_content"
                        role="presentation"
                        style="
                          table-layout: fixed;
                          vertical-align: top;
                          border-spacing: 0;
                          border-collapse: collapse;
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-top: 2px dotted #4d4d4d;
                          width: 100%;
                        "
                        valign="top"
                        width="100%"
                      >
                        <tbody>
                          <tr
                            style="vertical-align: top"
                            valign="top"
                          >
                            <td
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                              "
                              valign="top"
                            >
                              <span></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
              <div
                style="
                  color: #a5a5a5;
                  font-family: Trebuchet MS, Lucida Grande,
                    Lucida Sans Unicode, Lucida Sans, Tahoma,
                    sans-serif;
                  line-height: 1.5;
                  padding-top: 10px;
                  padding-right: 10px;
                  padding-bottom: 10px;
                  padding-left: 10px;
                "
              >
                <div
                  class="txtTinyMce-wrapper"
                  style="
                    font-size: 12px;
                    line-height: 1.5;
                    color: #a5a5a5;
                    font-family: Trebuchet MS, Lucida Grande,
                      Lucida Sans Unicode, Lucida Sans, Tahoma,
                      sans-serif;
                    mso-line-height-alt: 18px;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 12px;
                      text-align: center;
                      line-height: 1.5;
                      word-break: break-word;
                      mso-line-height-alt: 18px;
                      margin-top: 0;
                      margin-bottom: 0;
                    "
                  >
                    You are receiving this email because you have
                    opted in for the weekly email summary for one or
                    more of your watchlists on
                    <span style="color: #cccccc"
                      ><strong
                        ><a
                          href="https://mywatchlists.watch"
                          rel="noopener"
                          style="
                            text-decoration: underline;
                            color: #999;
                          "
                          target="_blank"
                          >mywatchlists.watch</a
                        ><br /></strong
                    ></span>
                  </p>
                  <p
                    style="
                      margin: 0;
                      font-size: 12px;
                      text-align: center;
                      line-height: 1.5;
                      word-break: break-word;
                      mso-line-height-alt: 18px;
                      margin-top: 0;
                      margin-bottom: 0;
                    "
                  >
                     
                  </p>
                  <p
                    style="
                      margin: 0;
                      font-size: 12px;
                      text-align: center;
                      line-height: 1.5;
                      word-break: break-word;
                      mso-line-height-alt: 18px;
                      margin-top: 0;
                      margin-bottom: 0;
                    "
                  >
                    If you would prefer not to receive emails anymore,
                    you can
                    <strong
                      ><a
                        href="https://mywatchlists.watch/account"
                        rel="noopener"
                        style="
                          text-decoration: underline;
                          color: #999;
                        "
                        target="_blank"
                        >unsubscribe from all</a
                      ></strong
                    >
                    in your account or
                    <strong
                      ><a
                        href="https://mywatchlists.watch/lists"
                        rel="noopener"
                        style="
                          text-decoration: underline;
                          color: #999;
                        "
                        target="_blank"
                        >unselect</a
                      ></strong
                    >
                    the "Emails" option for individual watchlists to
                    receive fewer emails.
                  </p>
                </div>
              </div>
              <!--[if mso]></td></tr></table><![endif]-->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="divider"
                role="presentation"
                style="
                  table-layout: fixed;
                  vertical-align: top;
                  border-spacing: 0;
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  min-width: 100%;
                  -ms-text-size-adjust: 100%;
                  -webkit-text-size-adjust: 100%;
                "
                valign="top"
                width="100%"
              >
                <tbody>
                  <tr style="vertical-align: top" valign="top">
                    <td
                      class="divider_inner"
                      style="
                        word-break: break-word;
                        vertical-align: top;
                        min-width: 100%;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        padding-top: 15px;
                        padding-right: 10px;
                        padding-bottom: 15px;
                        padding-left: 10px;
                      "
                      valign="top"
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="divider_content"
                        role="presentation"
                        style="
                          table-layout: fixed;
                          vertical-align: top;
                          border-spacing: 0;
                          border-collapse: collapse;
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-top: 2px dotted #4d4d4d;
                          width: 100%;
                        "
                        valign="top"
                        width="100%"
                      >
                        <tbody>
                          <tr
                            style="vertical-align: top"
                            valign="top"
                          >
                            <td
                              style="
                                word-break: break-word;
                                vertical-align: top;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                              "
                              valign="top"
                            >
                              <span></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 20px; font-family: Tahoma, sans-serif"><![endif]-->
              <div
                style="
                  color: #a5a5a5;
                  font-family: Trebuchet MS, Lucida Grande,
                    Lucida Sans Unicode, Lucida Sans, Tahoma,
                    sans-serif;
                  line-height: 1.5;
                  padding-top: 10px;
                  padding-right: 10px;
                  padding-bottom: 20px;
                  padding-left: 10px;
                "
              >
                <div
                  class="txtTinyMce-wrapper"
                  style="
                    line-height: 1.5;
                    font-size: 12px;
                    font-family: Trebuchet MS, Lucida Grande,
                      Lucida Sans Unicode, Lucida Sans, Tahoma,
                      sans-serif;
                    color: #a5a5a5;
                    mso-line-height-alt: 18px;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      line-height: 1.5;
                      word-break: break-word;
                      text-align: center;
                      mso-line-height-alt: 18px;
                      margin-top: 0;
                      margin-bottom: 0;
                    "
                  >
                    The&nbsp;Watchlist&nbsp;App&nbsp;&nbsp;| 
                    London,&nbsp;UK&nbsp;&nbsp;| 
                    <a
                      href="mailto:contact@mywatchlists.watch?subject=Enquiry"
                      rel="noopener"
                      style="text-decoration: none; color: #a5a5a5"
                      target="_blank"
                      >contact@mywatchlists.watch</a
                    >
                  </p>
                </div>
              </div>
              <!--[if mso]></td></tr></table><![endif]-->
              <!--[if (!mso)&(!IE)]><!-->
            </div>
            <!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
  </div>
  <div style="background-color: #f8d070">
    <div
      class="block-grid"
      style="
        min-width: 320px;
        max-width: 600px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        margin: 0 auto;
        background-color: transparent;
      "
    >
      <div
        style="
          border-collapse: collapse;
          display: table;
          width: 100%;
          background-color: transparent;
          background-image: url('https://mywatchlists.watch/top.png');
          background-position: top left;
          background-repeat: repeat;
        "
      >
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
        <div
          class="col num12"
          style="
            min-width: 320px;
            max-width: 600px;
            display: table-cell;
            vertical-align: top;
            width: 600px;
          "
        >
          <div class="col_cont" style="width: 100% !important">
            <!--[if (!mso)&(!IE)]><!-->
            <div
              style="
                border-top: 0px solid transparent;
                border-left: 0px solid transparent;
                border-bottom: 0px solid transparent;
                border-right: 0px solid transparent;
                padding-top: 0px;
                padding-bottom: 0px;
                padding-right: 0px;
                padding-left: 0px;
              "
            >
              <!--<![endif]-->
              <div
                style="
                  font-size: 16px;
                  text-align: center;
                  font-family: Trebuchet MS, Lucida Grande,
                    Lucida Sans Unicode, Lucida Sans, Tahoma,
                    sans-serif;
                "
              >
                <div style="height: 60px"></div>
              </div>
              <!--[if (!mso)&(!IE)]><!-->
            </div>
            <!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
  </div>
  <div style="background-color: #f8d070">
    <div
      class="block-grid"
      style="
        min-width: 320px;
        max-width: 600px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        margin: 0 auto;
        background-color: transparent;
      "
    >
      <div
        style="
          border-collapse: collapse;
          display: table;
          width: 100%;
          background-color: transparent;
        "
      >
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div
          class="col num12"
          style="
            min-width: 320px;
            max-width: 600px;
            display: table-cell;
            vertical-align: top;
            width: 600px;
          "
        >
          <div class="col_cont" style="width: 100% !important">
            <!--[if (!mso)&(!IE)]><!-->
            <div
              style="
                border-top: 0px solid transparent;
                border-left: 0px solid transparent;
                border-bottom: 0px solid transparent;
                border-right: 0px solid transparent;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-right: 0px;
                padding-left: 0px;
              "
            >
              <!--<![endif]-->
              <table
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  table-layout: fixed;
                  vertical-align: top;
                  border-spacing: 0;
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                "
                valign="top"
                width="100%"
              >
                <tr style="vertical-align: top" valign="top">
                  <td
                    align="center"
                    style="
                      word-break: break-word;
                      vertical-align: top;
                      padding-top: 5px;
                      padding-right: 0px;
                      padding-bottom: 5px;
                      padding-left: 0px;
                      text-align: center;
                    "
                    valign="top"
                  >
                    <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                    <!--[if !vml]><!-->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      class="icons-inner"
                      role="presentation"
                      style="
                        table-layout: fixed;
                        vertical-align: top;
                        border-spacing: 0;
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        display: inline-block;
                        margin-right: -4px;
                        padding-left: 0px;
                        padding-right: 0px;
                      "
                      valign="top"
                    >
                      <!--<![endif]-->
                      <tr style="vertical-align: top" valign="top">
                        <td
                          align="center"
                          style="
                            word-break: break-word;
                            vertical-align: top;
                            text-align: center;
                            padding-top: 5px;
                            padding-bottom: 5px;
                            padding-left: 5px;
                            padding-right: 6px;
                          "
                          valign="top"
                        >
                          <a href="https://www.designedwithbee.com/"
                            ><img
                              align="center"
                              alt="Designed with BEE"
                              class="icon"
                              height="32"
                              src="https://mywatchlists.watch/bee.png"
                              style="border: 0"
                              width="null"
                          /></a>
                        </td>
                        <td
                          style="
                            word-break: break-word;
                            font-family: Trebuchet MS, Lucida Grande,
                              Lucida Sans Unicode, Lucida Sans, Tahoma,
                              sans-serif;
                            font-size: 15px;
                            color: #9d9d9d;
                            vertical-align: middle;
                            letter-spacing: undefined;
                          "
                          valign="middle"
                        >
                          <a
                            href="https://www.designedwithbee.com/"
                            style="
                              color: #9d9d9d;
                              text-decoration: none;
                            "
                            >Designed with BEE</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--[if (!mso)&(!IE)]><!-->
            </div>
            <!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
  </div>
  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>
  `;

  return top + middle + bottom;
}
