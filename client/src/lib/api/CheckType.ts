import API from "../../../axiosConfig";

export async function checkType(type: string, item_id: string) {
    try {
        const response = await API.get(`/${type}/${item_id}/is_exist/`, {
            validateStatus: (status) => status === 200 || status === 404, // Указываем, что 404 тоже приемлем
        });

        // Если статус 200, возвращаем true, иначе null
        if (response.status === 200) {
            return { item_id: item_id }; // Создаем фейковый объект курса
        }
        return null;
    } catch (error) {
        throw error;
    }
}