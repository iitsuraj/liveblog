import React from 'react';
import PropTypes from 'prop-types';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

const SocialShare = ({ entry }) => {
  const { heading, share_link } = entry;
  return (
    <div className="liveblog-entry-share">
      <TwitterShareButton
        url={share_link}
        title={heading}
        aria-label="Share on Twitter"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <FacebookShareButton
        url={share_link}
        quote={heading}
        aria-label="Share on Facebook"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton
        url={share_link}
        title={heading}
        aria-label="Share on Whatsapp"
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
};

SocialShare.propTypes = {
  entry: PropTypes.object,
};

export default SocialShare;
