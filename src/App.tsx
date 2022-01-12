import { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  useEffect(() => {
    if (localStorage.getItem("toDos")) {
      setToDos(JSON.parse(localStorage.getItem("toDos") as string));
    }
  }, [setToDos]);

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const target = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, target);
        const result = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem("toDos", JSON.stringify(result));
        return result;
      });
    } else {
      setToDos((allBoards) => {
        const sourceCopy = [...allBoards[source.droppableId]];
        const destinationCopy = [...allBoards[destination.droppableId]];
        const target = sourceCopy[source.index];
        sourceCopy.splice(source.index, 1);
        destinationCopy.splice(destination.index, 0, target);
        const result = {
          ...allBoards,
          [source.droppableId]: sourceCopy,
          [destination.droppableId]: destinationCopy,
        };
        localStorage.setItem("toDos", JSON.stringify(result));
        return result;
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
