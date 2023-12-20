import Navbar from "../components/Navbar";
import Hamburger from "../components/hamburger";
import JsonCode from "../components/JsonCode";
import ImageCode from "../components/ImageCode";
import SqlCode from "../components/SqlCode";
import TextCode from "../components/TextCode";
import { useState } from "react";

export default function Chat() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuOptions, setMenuOptions] = useState({
    jsonCode: true,
    imageCode: false,
    textCode: false,
    sqlCode: false,
  });

  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleMenuOptions = (option) => {
    setMenuOptions({
      jsonCode: option === "jsonCode",
      imageCode: option === "imageCode",
      sqlCode: option === "sqlCode",
      textCode: option === "textCode",
    });
  };
  return (
    <div className="bg-[#EFF3F8] h-screen w-screen sm::flex">
      <div className="fixed  z-10 hidden sm:flex w-60 md:w-80 bg-slate-200 border-r-2 border-black h-screen">
        <div className="hidden sm:flex ">
          <Navbar handleMenuOptions={handleMenuOptions} />
        </div>
      </div>
      <div className="flex  sm:hidden">
        <Hamburger
          isMenuOpen={isMenuOpen}
          handleToggleMenu={handleToggleMenu}
          handleMenuOptions={handleMenuOptions}
        />
      </div>
      {!isMenuOpen && (
        // <div className="absolute w-screen px-6 py-2 sm:py-6 sm:px-60 md:pl-96">
        <div className="fixed w-screen  py-2 sm:py-6  px-6 sm:pl-72 md:pl-96 sm:pr-6 md:pr-20">
          <div>
            {menuOptions.jsonCode && <JsonCode />}
            {menuOptions.imageCode && <ImageCode />}
            {menuOptions.textCode && <TextCode />}
            {menuOptions.sqlCode && <SqlCode />}
          </div>
        </div>
      )}
    </div>
  );
}
