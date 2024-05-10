import React, { useEffect, useState } from "react";
import {
  useCreateHolidayMutation,
  useGetHolidayByIdQuery,
  useUpdateHolidayMutation,
} from "../../Apis/holidayApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const initialHolidayData = {
  holidayName: "",
  date: "",
  comment: "",
};

function HolidayUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [holidayInputs, setHolidayInputs] = useState(initialHolidayData);
  const [loading, setLoading] = useState(false);
  const [createHoliday] = useCreateHolidayMutation();
  const [updateHoliday] = useUpdateHolidayMutation();
  const { data } = useGetHolidayByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        holidayName: data.result.holidayName,
        date: data.result.date,
        comment: data.result.comment,

     
      };
      setHolidayInputs(tempData);
    }
  }, [data]);

  const handleHolidayInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tempData = inputHelper(e, holidayInputs);
    setHolidayInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("holidayName", holidayInputs.holidayName);
    formData.append("date", holidayInputs.date);
    formData.append("comment", holidayInputs.comment);
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateHoliday({ data: formData, id });
      toastNotify("Holiday updated successfully", "success");
    } else {
      // create
      response = await createHoliday(formData);
      toastNotify("Holiday created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/holiday/holidaylist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Holiday" : "Add Holiday"}
      </h3>
      
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
  <div className="row mt-3">
    <div className="col-md-7">
      <input
        type="text"
        className="form-control"
        placeholder="Enter Name"
        required
        name="holidayName"
        value={holidayInputs.holidayName}
        onChange={handleHolidayInput}
      />
      <div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="date">Date:</label>
          <DatePicker 
            className="form-control"
            selected={holidayInputs.date ? new Date(holidayInputs.date) : null} 
            onChange={(date: Date | null) => setHolidayInputs({ ...holidayInputs, date: date ? date.toISOString() : "" })}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
      <input
        type="text"
        className="form-control"
        placeholder="Enter Comment"
        required
        name="comment"
        value={holidayInputs.comment}
        onChange={handleHolidayInput}
      />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <button
            type="submit"
            className="btn btn-success form-control mt-3"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
        <div className="col-6">
          <a
            onClick={() => navigate("/holiday/holidaylist")}
            className="btn btn-secondary form-control mt-3"
          >
            Back to Holiday
          </a>
        </div>
      </div>
    </div>
  </div>
</form>

    </div>
  );
}

export default HolidayUpsert;
