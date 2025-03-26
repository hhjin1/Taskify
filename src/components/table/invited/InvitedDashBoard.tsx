import { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import NoDashboardMessage from "./NoResultDashBoard";
import EmptyInvitations from "./EmptyInvitations";

interface Invite {
  title: string;
  nickname: string;
}

const invitedData: Invite[] = [
  { title: "프로덕트 디자인", nickname: "손동희" },
  { title: "새로운 기획 문서", nickname: "안귀영" },
  { title: "유닛 A", nickname: "장혁" },
  { title: "유닛 B", nickname: "강나무" },
  { title: "유닛 C", nickname: "김태현" },
  { title: "유닛 D", nickname: "김태현" },
  { title: "유닛 E", nickname: "이정민" },
  { title: "유닛 F", nickname: "박소영" },
  { title: "유닛 G", nickname: "최준호" },
  { title: "유닛 H", nickname: "배지훈" },
];

const ITEMS_PER_PAGE = 6; // 한 번에 보여줄 개수

function InvitedList({ searchTitle }: { searchTitle: string }) {
  const [displayedData, setDisplayedData] = useState<Invite[]>([]);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMore = displayedData.length < invitedData.length; // 남은 데이터가 있는지 확인

  useEffect(() => {
    loadMoreData(); // 초기 데이터 로드
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [displayedData, hasMore]);

  // 새로운 데이터 로드 (기존 데이터에서 6개씩 추가)
  const loadMoreData = () => {
    setDisplayedData((prevData) => {
      const nextData = invitedData.slice(0, prevData.length + ITEMS_PER_PAGE);
      return nextData;
    });
    setPage((prevPage) => prevPage + 1);
  };

  // 검색 기능
  const filteredData = displayedData.filter(
    (invite) =>
      invite.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      invite.nickname.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className="relative bg-white w-[260px] sm:w-[504px] lg:w-[1022px] h-[770px] sm:h-[592px] lg:h-[620px] w mx-auto mt-[40px]">
      {filteredData.length > 0 && (
        <div className="p-6 flex w-full h-[26px] justify-start items-center pl-[43px] pr-[76px]  md:gap-x-[50px] lg:gap-x-[280px]">
          <p className="font-normal text-[var(--color-gray2)] ">이름</p>
          <p className="font-normal text-[var(--color-gray2)] ">초대자</p>
          <p className="font-normal text-[var(--color-gray2)] ">수락여부</p>
        </div>
      )}
      <div className="scroll-area h-[400px] overflow-y-auto overflow-x-hidden">
        {filteredData.length > 0
          ? filteredData.map((invite, index) => (
              <div
                key={index}
                className="pb-5 mb-[20px] w-[260px] sm:w-[504px] lg:w-[1022px] h-[50px] 
            sm:grid sm:grid-cols-[1fr_1fr_1fr] sm:items-center 
            flex flex-col gap-2 border-b border-[var(--color-gray4)]"
              >
                <p className="flex mt-1">{invite.title}</p>
                <p className="justify-center mt-1">{invite.nickname}</p>
                <div className="flex gap-2 mt-1 justify-between sm:justify-start">
                  <button className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]">
                    수락
                  </button>
                  <button className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]">
                    거절
                  </button>
                </div>
              </div>
            ))
          : // "대시보드가 없습니다." 메시지는 데이터가 아예 없을 때만 표시
            !hasMore && <NoDashboardMessage searchTitle={searchTitle} />}
      </div>
    </div>
  );
}

export default function InvitedDashBoard() {
  const [searchTitle, setSearchTitle] = useState("");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.target.value);
  };

  // invitedData가 비어 있으면 EmptyInvitations만 렌더링
  if (invitedData.length === 0) {
    return <EmptyInvitations />;
  }

  return (
    <div>
      <div className="relative bg-white rounded-lg shadow-mdw-[260px] sm:w-[504px] lg:w-[1022px] h-[770px] sm:h-[592px] lg:h-[620px] max-w-none mx-auto">
        <div className="p-6 relative w-[966px] h-[104px]">
          <div className="flex justify-between items-center mb-[32px]">
            <p className="text-xl sm:text-2xl font-bold">초대받은 대시보드</p>
          </div>
          <div className="relative w-[260px] sm:w-[448px] lg:w-[966px]">
            <input
              id="title"
              placeholder="검색"
              type="text"
              value={searchTitle}
              onChange={handleSearchInputChange}
              className="text-[var(--color-gray2)] w-full h-[40px] px-[40px] py-[6px] border border-[#D9D9D9] bg-white rounded-[6px] placeholder-gray-400 outline-none"
            />
            <Image
              src="/svgs/search.svg"
              alt="검색 아이콘"
              width={20}
              height={20}
              className="absolute left-[12px] top-1/2 transform -translate-y-1/2"
            />
          </div>
        </div>
        <InvitedList searchTitle={searchTitle} />
      </div>
    </div>
  );
}
