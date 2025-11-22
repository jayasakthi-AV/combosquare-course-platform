import logo from "../../assets/logo.png";


export default function Logo() {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="Combo Square"
        className="h-12 md:h-14 w-auto drop-shadow-[0_0_12px_rgba(0,0,0,0.35)] rounded-md"
      />
    </div>
  );
}
