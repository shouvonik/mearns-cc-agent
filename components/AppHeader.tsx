import Image from "next/image";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur border-b border-[#1e2f70] px-4 bg-[#080f2e]/95">
      <div className="max-w-lg mx-auto py-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-white">
            <Image
              src="/club-logo.jpg"
              alt="Mearns CC"
              width={44}
              height={44}
              className="w-full h-full object-cover scale-[1.4]"
              priority
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-base leading-tight">{title}</h1>
            <p className="text-[#8fa8d8] text-xs">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
