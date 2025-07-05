import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";

import NextErrorComponent from "next/error";
import * as Sentry from "@sentry/nextjs";
import SEO from "../components/SEO";
import Text from "../components/Text";
import LocaleContext from "../utils/LocaleContext";

const ErrorPage = () => {
  const [rateLimited, setRateLimited] = useState(false);

  const SQ_API_URL = process.env.SQ_API_URL;
  const SQ_SITE_NAME = process.env.SQ_SITE_NAME;

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        const res = await fetch(SQ_API_URL);
        if (res.status === 429) setRateLimited(true);
      } catch (e) {}
    };
    checkRateLimit();
  }, []);

  const { getLocaleString } = useContext(LocaleContext);

  return (
    <>
      <SEO title={getLocaleString("404NotFound")} />
      <Text as="h1" mb={5}>
        {getLocaleString("errSomethingWentWrong")} :(
      </Text>
      {rateLimited ? (
        <Text>{getLocaleString("errTooManyRequests")}</Text>
      ) : (
        <Text>
          {getLocaleString("errIfErrorPersist")}{" "}
          <a
            href="https://github.com/EFFXCT290/NexusTracker/issues"
            target="_blank"
            rel="noreferrer"
          >
            {getLocaleString("errReportIt")}
          </a>
          . For now,{" "}
          <Link href="/" legacyBehavior>
            <a>{getLocaleString("404ReturnHome")}</a>
          </Link>
          .
        </Text>
      )}
    </>
  );
};

ErrorPage.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextErrorComponent.getInitialProps(contextData);
};

export default ErrorPage;
