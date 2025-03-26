interface RandomProfileProps {
  name: string;
  index?: number;
}

// 4개의 고정된 색상 배열
const colors = ["bg-[#C4B1A2]", "bg-[#9DD7ED]", "bg-[#FDD446]", "bg-[#FFC85A]"];

export default function RandomProfile({ name, index }: RandomProfileProps) {
  // index가 있을 경우 순서대로 색상 할당, 없으면 랜덤으로 색상 할당
  const bgColor =
    index !== undefined
      ? colors[index % colors.length]
      : colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={`flex items-center justify-center text-white font-bold rounded-full ${bgColor} w-[38px] h-[38px] border-2`}
    >
      {name[0]}
    </div>
  );
}
