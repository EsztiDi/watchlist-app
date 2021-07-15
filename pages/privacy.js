import Head from "next/head";
import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2.5),
    "& > h6:first-of-type": {
      marginTop: theme.spacing(1),
    },
    "& > h5, > h6": {
      margin: theme.spacing(1.5),
      marginTop: theme.spacing(2.5),
    },
    "& > p, li": {
      margin: theme.spacing(1.5),
      marginTop: theme.spacing(1.5),
    },
    "& > ul, a": {
      fontSize: "1rem",
    },
    "& a": {
      textDecoration: "underline",
      // margin: theme.spacing(2),
    },
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
}));

export default function PrivacyPolicy() {
  const classes = useStyles();
  const variant = "h5";

  return (
    <>
      <Head>
        <title>Privacy Notice - My Watchlists</title>
      </Head>
      <Container maxWidth="md">
        <Paper elevation={4} className={classes.paper}>
          <Typography variant="h4">Privacy Notice</Typography>
          <Typography variant="subtitle2" align="center">
            Last updated 15 July 2021
          </Typography>

          <Typography>
            Thank you for using the Watchlist App created by Eszter Diana Toth
            (&quot;<b>App</b>&quot;, &quot;<b>we</b>&quot;, &quot;<b>us</b>
            &quot;, &quot;<b>our</b>&quot;). We are committed to protecting your
            personal information and your right to privacy. If you have any
            questions or concerns about this privacy notice, or our practices
            with regards to your personal information, please contact us at
            thewatchlistapp@gmail.com .
          </Typography>
          <Typography>
            When you visit our website {process.env.BASE_URL} (the &quot;
            <b>Website</b>&quot;), and more generally, use any of our services
            (the &quot;
            <b>Services</b>&quot;, which include the Website), we appreciate
            that you are trusting us with your personal information. We take
            your privacy very seriously. In this privacy notice, we seek to
            explain to you in the clearest way possible what information we
            collect, how we use it and what rights you have in relation to it.
            We hope you take some time to read through it carefully, as it is
            important. If there are any terms in this privacy notice that you do
            not agree with, please discontinue use of our Services immediately.
          </Typography>
          <Typography>
            This privacy notice applies to all information collected through our
            Services (which, as described above, includes our Website), as well
            as, any related services, sales, marketing or events.
          </Typography>
          <Typography className={classes.bold}>
            Please read this privacy notice carefully as it will help you
            understand what we do with the information that we collect.
          </Typography>

          <Typography variant={variant}>Table of contents</Typography>
          <Typography>
            <a href="#1">1. What information do we collect?</a>
          </Typography>
          <Typography>
            <a href="#2">2. How do we use your information?</a>
          </Typography>
          <Typography>
            <a href="#3">
              3. How can you update or delete the data we collect from you?
            </a>
          </Typography>
          <Typography>
            <a href="#4">4. Will your information be shared with anyone?</a>
          </Typography>
          <Typography>
            <a href="#5">5. How do we handle your social logins?</a>
          </Typography>
          <Typography>
            <a href="#6">6. How long do we keep your information?</a>
          </Typography>
          <Typography>
            <a href="#7">7. How do we keep your information safe?</a>
          </Typography>
          <Typography>
            <a href="#8">8. What are your privacy rights?</a>
          </Typography>
          <Typography>
            <a href="#9">9. Controls for Do-Not-Track features</a>
          </Typography>
          <Typography>
            <a href="#10">
              10. The specific privacy rights of California residents
            </a>
          </Typography>
          <Typography>
            <a href="#11">11. Do we make updates to this notice?</a>
          </Typography>
          <Typography>
            <a href="#12">12. How can you contact us about this notice?</a>
          </Typography>

          <Typography variant={variant} id="1">
            1. What information do we collect?
          </Typography>
          <Typography className={classes.italic}>
            In Short: We collect personal information that you provide to us
          </Typography>
          <Typography>
            We collect personal information that you voluntarily provide to us
            when you register on the Website, express an interest in obtaining
            information about us or our products and Services, when you
            participate in activities on the Website or otherwise when you
            contact us
          </Typography>
          <Typography>
            The personal information that we collect depends on the context of
            your interactions with us and the Website, the choices you make and
            the products and features you use. The personal information we
            collect may include the following:
          </Typography>
          <ul>
            <li>
              <b>Personal information provided by you</b> - We collect names and
              email addresses
            </li>
            <li>
              <b>Social media login data</b> - We may provide you with the
              option to register with us using your existing social media
              account details, like your Facebook, Twitter or other social media
              account. If you choose to register in this way, we will collect
              the information described in the section called &quot;How do we
              handle your Social logins?&quot; below.
            </li>
          </ul>
          <Typography variant={variant} id="2">
            2. How do we use your information?
          </Typography>
          <Typography className={classes.italic}>
            In Short: We process your information for purposes based on
            legitimate business interests, the fulfillment of our contract with
            you, compliance with our legal obligations, and/or your consent.
          </Typography>
          <Typography>
            We use personal information collected via our Website for a variety
            of business purposes described below. We process your personal
            information for these purposes in reliance on our legitimate
            business interests, in order to enter into or perform a contract
            with you, with your consent, and/or for compliance with our legal
            obligations. We indicate the specific processing grounds we rely on
            next to each purpose listed below.
          </Typography>
          <Typography>
            In legal terms, we are generally the &quot;data controller&quot;
            under European data protection laws since we determine the means
            and/or purposes of the data processing we perform. However, if you
            are a business customer with whom we have entered into a data
            processing agreement for the provision of corporate services to you,
            then you would be the &quot;data controller&quot; and we would be
            the &quot;data processor&quot; under European data protection laws
            since we would be processing data on your behalf in accordance with
            your instructions.
          </Typography>
          <Typography>We use the information we collect or receive:</Typography>
          <ul>
            <li>
              <b>To facilitate account creation and logon process</b> - If you
              choose to link your account with us to a third-party account (such
              as your Google or Facebook account), we use the information you
              allowed us to collect from those third parties to facilitate
              account creation and logon process for the performance of the
              contract. See the section below headed &quot;How do we handle your
              Social logins?&quot; for further information.
            </li>
            <li>
              <b>For other business purposes</b> - We may use your information
              for other business purposes, such as data analysis, identifying
              usage trends, determining the effectiveness of our promotional
              campaigns and to evaluate and improve our Website, products,
              marketing and your experience. We may use and store this
              information in aggregated and anonymized form so that it is not
              associated with individual end users and does not include personal
              information. We will not use identifiable personal information
              without your consent.
            </li>
          </ul>
          <Typography variant={variant} id="3">
            3. How can you update or delete the data we collect from you?
          </Typography>
          <Typography>
            Based on the applicable laws of your country, you may have the right
            to request access to the personal information we collect from you,
            change that information, or delete it in some circumstances. To
            request to review, update, or delete your personal information,
            please visit:{" "}
            <Link href="/account" passHref>
              <a>{process.env.BASE_URL}/account</a>
            </Link>
            .
          </Typography>
          <Typography variant={variant} id="4">
            4. Will your information be shared with anyone?
          </Typography>
          <Typography className={classes.italic}>
            In Short: We only share information with your consent, to comply
            with laws, to provide you with services, to protect your rights, or
            to fulfill business obligations.
          </Typography>
          <Typography>
            We may process or share your data that we hold based on the
            following legal basis:
          </Typography>
          <ul>
            <li>
              <b>Consent:</b>&nbsp;We may process your data if you have given us
              specific consent to use your personal information for a specific
              purpose.
            </li>
            <li>
              <b>Legitimate interests:</b>&nbsp;We may process your data when it
              is reasonably necessary to achieve our legitimate business
              interests.
            </li>
            <li>
              <b>Performance of a contract:</b>&nbsp;Where we have entered into
              a contract with you, we may process your personal information to
              fulfill the terms of our contract.
            </li>
            <li>
              <b>Legal obligations:</b>&nbsp;We may disclose your information
              where we are legally required to do so in order to comply with
              applicable law, governmental requests, a judicial proceeding,
              court order, or legal process, such as in response to a court
              order or a subpoena (including in response to public authorities
              to meet national security or law enforcement requirements).
            </li>
            <li>
              <b>Vital interests:</b>&nbsp;We may disclose your information
              where we believe it is necessary to investigate, prevent, or take
              action regarding potential violations of our policies, suspected
              fraud, situations involving potential threats to the safety of any
              person and illegal activities, or as evidence in litigation in
              which we are involved.
            </li>
          </ul>
          <Typography variant={variant} id="5">
            5. How do we handle your social logins?
          </Typography>
          <Typography className={classes.italic}>
            In Short: If you choose to register or log in to our services using
            a social media account, we may have access to certain information
            about you.
          </Typography>
          <Typography>
            Our Website offers you the ability to register and log in using your
            third-party social media account details (like your Facebook or
            Twitter logins). Where you choose to do this, we will receive
            certain profile information about you from your social media
            provider. The profile information we receive may vary depending on
            the social media provider concerned, but will often include your
            name, email address, profile picture as well as other information
            you choose to make public on such social media platform.
          </Typography>
          <Typography>
            We will use the information we receive only for the purposes that
            are described in this privacy notice or that are otherwise made
            clear to you on the relevant Website. Please note that we do not
            control, and are not responsible for, other uses of your personal
            information by your third-party social media provider. We recommend
            that you review their privacy notice to understand how they collect,
            use and share your personal information, and how you can set your
            privacy preferences on their sites and apps.
          </Typography>
          <Typography variant={variant} id="6">
            6. How long do we keep your information?
          </Typography>
          <Typography className={classes.italic}>
            In Short: We keep your information for as long as necessary to
            fulfill the purposes outlined in this privacy notice unless
            otherwise required by law.
          </Typography>
          <Typography>
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this privacy notice, unless a
            longer retention period is required or permitted by law (such as
            tax, accounting or other legal requirements). No purpose in this
            notice will require us keeping your personal information for longer
            than the period of time in which users have an account with us.
          </Typography>
          <Typography>
            When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize such
            information, or, if this is not possible (for example, because your
            personal information has been stored in backup archives), then we
            will securely store your personal information and isolate it from
            any further processing until deletion is possible.
          </Typography>
          <Typography variant={variant} id="7">
            7. How do we keep your information safe?
          </Typography>
          <Typography className={classes.italic}>
            In Short: We aim to protect your personal information through a
            system of organizational and technical security measures.
          </Typography>
          <Typography>
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, despite our safeguards and efforts
            to secure your information, no electronic transmission over the
            Internet or information storage technology can be guaranteed to be
            100% secure, so we cannot promise or guarantee that hackers,
            cybercriminals, or other unauthorized third parties will not be able
            to defeat our security, and improperly collect, access, steal, or
            modify your information. Although we will do our best to protect
            your personal information, transmission of personal information to
            and from our Website is at your own risk. You should only access the
            Website within a secure environment.
          </Typography>
          <Typography variant={variant} id="8">
            8. What are your privacy rights?
          </Typography>
          <Typography className={classes.italic}>
            In Short: In some regions, such as the European Economic Area (EEA)
            and United Kingdom (UK), you have rights that allow you greater
            access to and control over your personal information. You may
            review, change, or terminate your account at any time.
          </Typography>
          <Typography>
            In some regions (like the EEA and UK), you have certain rights under
            applicable data protection laws. These may include the right (i) to
            request access and obtain a copy of your personal information, (ii)
            to request rectification or erasure; (iii) to restrict the
            processing of your personal information; and (iv) if applicable, to
            data portability. In certain circumstances, you may also have the
            right to object to the processing of your personal information. To
            make such a request, please use the contact details provided below.
            We will consider and act upon any request in accordance with
            applicable data protection laws.
          </Typography>
          <Typography>
            If we are relying on your consent to process your personal
            information, you have the right to withdraw your consent at any
            time. Please note however that this will not affect the lawfulness
            of the processing before its withdrawal, nor will it affect the
            processing of your personal information conducted in reliance on
            lawful processing grounds other than consent.
          </Typography>
          <Typography>
            If you are a resident in the EEA or UK and you believe we are
            unlawfully processing your personal information, you also have the
            right to complain to your local data protection supervisory
            authority. You can find their contact details here:{" "}
            <a
              href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
            </a>
            .
          </Typography>
          <Typography>
            If you are a resident in Switzerland, the contact details for the
            data protection authorities are available here:{" "}
            <a
              href="https://www.edoeb.admin.ch/edoeb/en/home.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.edoeb.admin.ch/edoeb/en/home.html
            </a>
            .
          </Typography>
          <Typography>
            If you have questions or comments about your privacy rights, you may
            email us at thewatchlistapp@gmail.com.
          </Typography>
          <Typography variant="h6">Account Information</Typography>
          <Typography>
            If you would at any time like to review or change the information in
            your account or terminate your account, you can log in to your
            account settings and update your user account.
          </Typography>
          <Typography>
            Upon your request to terminate your account, we will deactivate or
            delete your account and information from our active databases.
            However, we may retain some information in our files to prevent
            fraud, troubleshoot problems, assist with any investigations,
            enforce our Terms of Use and/or comply with applicable legal
            requirements.
          </Typography>
          <Typography variant="h6">
            Opting out of email communications
          </Typography>
          <Typography>
            You can unsubscribe from our email list at any time by clicking on
            the unsubscribe link in the emails that we send or by contacting us
            using the details provided below. You will then be removed from the
            email list — however, we may still communicate with you, for example
            to send you service-related emails that are necessary for the
            administration and use of your account, to respond to service
            requests, or for other non-marketing purposes. To otherwise opt-out,
            you may access your account settings and update your preferences.
          </Typography>
          <Typography variant={variant} id="9">
            9. Controls for Do-Not-Track features
          </Typography>
          <Typography>
            Most web browsers and some mobile operating systems and mobile
            applications include a Do-Not-Track (&quot;DNT&quot;) feature or
            setting you can activate to signal your privacy preference not to
            have data about your online browsing activities monitored and
            collected. At this stage no uniform technology standard for
            recognizing and implementing DNT signals has been finalized. As
            such, we do not currently respond to DNT browser signals or any
            other mechanism that automatically communicates your choice not to
            be tracked online. If a standard for online tracking is adopted that
            we must follow in the future, we will inform you about that practice
            in a revised version of this privacy notice.
          </Typography>
          <Typography variant={variant} id="10">
            10. The specific privacy rights of California residents
          </Typography>
          <Typography className={classes.italic}>
            In Short: If you are a resident of California, you are granted
            specific rights regarding access to your personal information.
          </Typography>
          <Typography>
            California Civil Code Section 1798.83, also known as the &quot;Shine
            The Light&quot; law, permits our users who are California residents
            to request and obtain from us, once a year and free of charge,
            information about categories of personal information (if any) we
            disclosed to third parties for direct marketing purposes and the
            names and addresses of all third parties with which we shared
            personal information in the immediately preceding calendar year. If
            you are a California resident and would like to make such a request,
            please submit your request in writing to us using the contact
            information provided below
          </Typography>
          <Typography>
            If you are under 18 years of age, reside in California, and have a
            registered account with the Website, you have the right to request
            removal of unwanted data that you publicly post on the Website. To
            request removal of such data, please contact us using the contact
            information provided below, and include the email address associated
            with your account and a statement that you reside in California. We
            will make sure the data is not publicly displayed on the Website,
            but please be aware that the data may not be completely or
            comprehensively removed from all our systems (e.g. backups, etc.)
          </Typography>
          <Typography variant={variant} id="11">
            11. Do we make updates to this notice?
          </Typography>
          <Typography className={classes.italic}>
            In Short: Yes, we will update this notice as necessary to stay
            compliant with relevant laws
          </Typography>
          <Typography>
            We may update this privacy notice from time to time. The updated
            version will be indicated by an updated &quot;Revised&quot; date and
            the updated version will be effective as soon as it is accessible.
            If we make material changes to this privacy notice, we may notify
            you either by prominently posting a notice of such changes or by
            directly sending you a notification. We encourage you to review this
            privacy notice frequently to be informed of how we are protecting
            your information.
          </Typography>
          <Typography variant={variant} id="12">
            12. How can you contact us about this notice?
          </Typography>
          <Typography>
            If you have questions or comments about this notice, you may email
            us at thewatchlistapp@gmail.com .
          </Typography>
          <Typography>
            If you are a resident in the European Economic Area or the United
            Kingdom, the &quot;data controller&quot; of your personal
            information is the Watchlist App. The Watchlist App has appointed
            Eszter Diana Toth to be its representative in the EEA. You can
            contact them directly regarding the processing of your information
            by the Watchlist App, by email at esztit@gmail.com
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
