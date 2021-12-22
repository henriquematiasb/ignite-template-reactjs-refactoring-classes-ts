import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food, { FoodType } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface StateProps {
  foods: FoodType[];
  editingFood: FoodType;
  modalOpen: boolean;
  editModalOpen: boolean;
}

function Dashboard() {
  const [state, setState] = useState<StateProps>({
    foods: [],
    editingFood: {} as FoodType,
    modalOpen: false,
    editModalOpen: false,
  });

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get("/foods");

      setState((prevState) => ({ ...prevState, foods: response.data }));
    }
    loadFoods();
  }, []);

  const handleAddFood = async (food: FoodType) => {
    try {
      console.log({
        food,
      });

      const response = await api.post<FoodType>("/foods", {
        ...food,
        available: true,
      });

      setState((prevState) => ({
        ...prevState,
        foods: [...prevState.foods, response.data],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodType) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setState((prevState) => ({ ...prevState, foods: foodsUpdated }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setState((prevState) => ({ ...prevState, foods: foodsFiltered }));
  };

  const toggleModal = () => {
    const { modalOpen } = state;

    setState((prevState) => ({ ...prevState, modalOpen: !modalOpen }));
  };

  const toggleEditModal = () => {
    const { editModalOpen } = state;

    setState((prevState) => ({ ...prevState, editModalOpen: !editModalOpen }));
  };

  const handleEditFood = (food: FoodType) => {
    setState((prevState) => ({
      ...prevState,
      editingFood: food,
      editModalOpen: true,
    }));
  };

  const { modalOpen, editModalOpen, editingFood, foods } = state;

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
