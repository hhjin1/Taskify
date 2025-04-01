import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { getDashboards } from "@/api/dashboards";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import SideMenu from "@/components/sideMenu/SideMenu";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import CardButton from "@/components/button/CardButton";
import DashboardAddButton from "@/components/button/DashboardAddButton";
import { PaginationButton } from "@/components/button/PaginationButton";
import InvitedDashBoard from "@/components/table/invited/InvitedDashBoard";
import NewDashboard from "@/components/modal/NewDashboard";
import { Modal } from "@/components/modal/Modal";
import { CustomBtn } from "@/components/button/CustomButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Dashboard {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

export default function MyDashboardPage() {
  const { user, isInitialized } = useAuthGuard();
  const teamId = "13-4";
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | null>(
    null
  );
  const [selectedCreatedByMe, setSelectedCreatedByMe] = useState<
    boolean | null
  >(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const itemsPerPage = 6;

  const totalPages = Math.ceil((dashboardList.length + 1) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = [
    <DashboardAddButton key="add" onClick={() => setIsModalOpen(true)} />,
    ...dashboardList.map((dashboard) => (
      <CardButton
        key={dashboard.id}
        dashboardId={dashboard.id}
        title={dashboard.title}
        showCrown={dashboard.createdByMe}
        color={dashboard.color}
        isEditMode={isEditMode}
        createdByMe={dashboard.createdByMe}
        onDeleteClick={(id) => {
          setSelectedDashboardId(id);
          setSelectedCreatedByMe(true);
          setSelectedTitle(dashboard.title);
          setIsDeleteModalOpen(true);
        }}
        onLeaveClick={(id) => {
          setSelectedDashboardId(id);
          setSelectedCreatedByMe(false);
          setSelectedTitle(dashboard.title);
          setIsDeleteModalOpen(true);
        }}
      />
    )),
  ].slice(startIndex, startIndex + itemsPerPage);

  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({ teamId });
      setDashboardList(res.dashboards);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (isInitialized && user) {
      fetchDashboards();
    }
  }, [isInitialized, user]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleDelete = async () => {
    if (!selectedDashboardId) return;
    try {
      await axiosInstance.delete(
        apiRoutes.DashboardDetail(selectedDashboardId)
      );
      setIsDeleteModalOpen(false);
      setSelectedDashboardId(null);
      fetchDashboards();
    } catch (error) {
      alert("대시보드 삭제에 실패했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  const handleLeave = () => {
    if (!selectedDashboardId) return;
    setDashboardList((prev) =>
      prev.filter((d) => d.id !== selectedDashboardId)
    );
    setIsDeleteModalOpen(false);
    setSelectedDashboardId(null);
  };

  if (!isInitialized || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu
        teamId={teamId}
        dashboardList={dashboardList}
        onCreateDashboard={() => fetchDashboards()}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard
          variant="mydashboard"
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        />

        <main className="flex-1 overflow-auto px-[25px] pt-[40px] pb-10 bg-[#f9f9f9] space-y-10">
          {/* 카드 영역 */}
          <section className="w-full px-[25px] max-w-[1100px] px-4">
            <div className="flex flex-wrap gap-[16px] justify-start">
              {currentItems.map((item, index) => (
                <div
                  key={index}
                  className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.66px)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {totalPages > 1 && (
            <div className="w-full max-w-[1100px] flex justify-center items-center ">
              <PaginationButton
                direction="left"
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              />
              <span className="font-14r text-black3 px-[8px] whitespace-nowrap">
                {`${totalPages} 페이지 중 ${currentPage}`}
              </span>
              <PaginationButton
                direction="right"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              />
            </div>
          )}

          {/* 초대받은 대시보드 */}
          <section className="w-full px-[25px]">
            <div className="mt-[74px]">
              <InvitedDashBoard />
            </div>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <NewDashboard
          onClose={() => {
            setIsModalOpen(false);
            fetchDashboards();
          }}
        />
      )}

      <Modal
        width="w-[260px]"
        height="h-[150px]"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="flex items-center justify-center text-center"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="text-[var(--primary)] font-16m">{selectedTitle}</div>

          <div className="text-black3 font-16m">
            {selectedCreatedByMe
              ? "대시보드를 삭제하시겠습니까?"
              : "대시보드에서 나가시겠습니까?"}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <CustomBtn
            onClick={() => setIsDeleteModalOpen(false)}
            className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]"
          >
            취소
          </CustomBtn>
          <CustomBtn
            onClick={selectedCreatedByMe ? handleDelete : handleLeave}
            className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]"
          >
            확인
          </CustomBtn>
        </div>
      </Modal>
    </div>
  );
}
