import React from "react";
import styled from "@emotion/styled";

const FooterContainer = styled.footer`
  background: #add7f6;

  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4.9px);
  -webkit-backdrop-filter: blur(4.9px);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer className="bg-gray-800 text-white text-center py-3 fixed bottom-0 w-full">
      <p>&copy; {currentYear} Incture. All Rights Reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
