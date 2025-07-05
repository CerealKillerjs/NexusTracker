import React, { useContext } from "react";

import { useRouter } from "next/router";
import qs from "qs";
import { withAuthServerSideProps } from "../utils/withAuth";
import SEO from "../components/SEO";
import Text from "../components/Text";
import TorrentList from "../components/TorrentList";
import LocaleContext from "../utils/LocaleContext";

const Bookmarks = ({ results }) => {
  const SQ_TORRENT_CATEGORIES = JSON.parse(process.env.SQ_TORRENT_CATEGORIES || '{}');

  const { getLocaleString } = useContext(LocaleContext);

  return (
    <>
      <SEO title={getLocaleString("bmYourBM")} />
      <Text as="h1" mb={5}>
        {getLocaleString("bmYourBM")}
      </Text>
      {results.torrents.length ? (
        <TorrentList
          torrents={results.torrents}
          categories={SQ_TORRENT_CATEGORIES}
          total={results.total}
        />
      ) : (
        <Text color="grey">{getLocaleString("bmYouNotHaveAnyBM")}</Text>
      )}
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps(
  async ({ token, fetchHeaders }) => {
    if (!token) return { props: {} };

    const SQ_API_URL = process.env.SQ_API_URL;

    try {
      const bookmarksRes = await fetch(`${SQ_API_URL}/account/bookmarks`, {
        headers: fetchHeaders,
      });
      if (
        bookmarksRes.status === 403 &&
        (await bookmarksRes.text()) === "User is banned"
      ) {
        throw "banned";
      } else {
        const results = await bookmarksRes.json();
        return { props: { results } };
      }
    } catch (e) {
      if (e === "banned") throw "banned";
      return { props: { results: { torrents: [] } } };
    }
  }
);

export default Bookmarks;
