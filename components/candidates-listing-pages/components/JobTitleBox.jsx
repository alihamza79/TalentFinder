'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addJobTitle } from "../../../features/filter/candidateFilterSlice"; // Import the new action for job title filtering

const JobTitleBox = () => {
    const { jobTitle } = useSelector((state) => state.candidateFilter) || {}; // Get jobTitle from Redux state
    const [getJobTitle, setJobTitle] = useState(jobTitle);
    const dispatch = useDispatch();

    // Job title handler
    const jobTitleHandler = (e) => {
        setJobTitle(e.target.value);
    };

    // Dispatch job title to Redux store
    useEffect(() => {
        dispatch(addJobTitle(getJobTitle)); // Dispatch job title to Redux
    }, [dispatch, getJobTitle]);

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="Job title"
                value={getJobTitle}
                onChange={jobTitleHandler}
            />
            <span className="icon flaticon-briefcase"></span>
        </>
    );
};

export default JobTitleBox;
