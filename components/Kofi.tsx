import Image from "next/image";

const Kofi = () => (
  <a
    href="https://ko-fi.com/J3J03D9N2"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      src="https://cdn.ko-fi.com/cdn/kofi1.png?v=2"
      alt="Buy Me a Coffee at ko-fi.com"
      width={580}
      height={146}
      style={{ width: "auto", height: "28px" }}
      priority
    />
  </a>
);

export default Kofi;
