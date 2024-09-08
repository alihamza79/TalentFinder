'use client'

import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../features/filter/candidateFilterSlice";
import categories from "../../../data/categories"; // Import categories data

const Categories = () => {
    const { category } = useSelector((state) => state.candidateFilter) || {};
    const dispatch = useDispatch();

    // Category handler
    const categoryHandler = (e) => {
        dispatch(addCategory(e.target.value)); // Dispatch selected category
    };

    return (
        <>
            <select onChange={categoryHandler} value={category} className="form-select">
                <option value="">Choose a category</option>
                {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                ))}
            </select>
            <span className="icon flaticon-briefcase"></span>
        </>
    );
};

export default Categories;
