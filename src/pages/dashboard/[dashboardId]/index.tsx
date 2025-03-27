import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getColumns, getCardsByColumn } from "@/api/dashboard";
import { CardType, ColumnType, TasksByColumn } from "@/types/task";
import HeaderBebridge from "@/components/gnb/HeaderBebridge";
import Column from "@/components/columnCard/Column";
import SideMenu from "@/components/sideMenu/SideMenu";
import ColumnsButton from "@/components/button/ColumnsButton";
import { Modal } from "@/components/common/Modal/Modal";
import Input from "@/components/input/Input";
import { CustomBtn } from "@/components/button/CustomBtn";

export default function Dashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;
  const [isReady, setIsReady] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const openModal = () => setIsAddColumnModalOpen(true);
  const closeModal = () => setIsAddColumnModalOpen(false);
  const teamId = "13-4";

  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});

  // router 준비되었을 때 렌더링
  useEffect(() => {
    if (router.isReady && dashboardId) {
      setIsReady(true);
    }
  }, [router.isReady, dashboardId]);

  // 칼럼 + 카드 로딩
  useEffect(() => {
    if (!isReady || typeof dashboardId !== "string") return;

    const fetchColumnsAndCards = async () => {
      try {
        const columnRes = await getColumns({ teamId, dashboardId });
        setColumns(columnRes.data);

        const columnTasks: { [columnId: number]: CardType[] } = {};

        await Promise.all(
          columnRes.data.map(async (column: ColumnType) => {
            const cardRes = await getCardsByColumn({
              teamId,
              columnId: column.id,
            });
            columnTasks[column.id] = cardRes.cards;
          })
        );

        setTasksByColumn(columnTasks);
      } catch (err) {
        console.error("❌ 에러 발생:", err);
      }
    };

    fetchColumnsAndCards();
  }, [isReady, dashboardId]);

  if (!isReady) return <div>로딩 중...</div>;

  // ✅ dashboardList 더미 데이터
  const dashboardList = [
    {
      id: 1,
      title: "비브리지",
      color: "#7AC555",
      createdAt: "2024-01-26T05:42:12.264Z",
      updatedAt: "2024-01-26T05:42:12.264Z",
      createdByMe: true,
      userId: 10,
    },
    {
      id: 2,
      title: "코드잇",
      color: "#760DDE",
      createdAt: "2024-01-26T05:42:12.264Z",
      updatedAt: "2024-01-26T05:42:12.264Z",
      createdByMe: true,
      userId: 10,
    },
    {
      id: 3,
      title: "3분기 계획",
      color: "#FFA500",
      createdAt: "2024-01-26T05:42:12.264Z",
      updatedAt: "2024-01-26T05:42:12.264Z",
      createdByMe: false,
      userId: 11,
    },
  ];

  return (
    <div className="flex">
      <SideMenu dashboardList={dashboardList} teamId="13-4" />

      <div className="flex-1">
        <HeaderBebridge dashboardId={dashboardId} />

        <div className="flex gap-4 p-6">
          {columns.map((col) => (
            <Column
              key={col.id}
              title={col.title}
              tasks={tasksByColumn[col.id] || []}
            />
          ))}

          <ColumnsButton onClick={openModal} />

          {isAddColumnModalOpen && (
            <Modal
              isOpen={isAddColumnModalOpen}
              onClose={() => setIsAddColumnModalOpen(false)}
            >
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold">새 칼럼 생성</h2>

                <label className="font-medium flex flex-col gap-2">
                  이름
                  <Input type="text" placeholder="새로운 프로젝트" />
                </label>
                <div className="flex justify-between mt-1.5">
                  <CustomBtn
                    variant="outlineDisabled"
                    onClick={() => {
                      setIsAddColumnModalOpen(false);
                    }}
                  >
                    취소
                  </CustomBtn>
                  <CustomBtn>생성</CustomBtn>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
