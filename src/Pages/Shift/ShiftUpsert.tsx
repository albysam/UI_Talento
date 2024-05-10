import React, { useEffect, useState } from "react";
import {
  useCreateShiftMutation,
  useGetShiftByIdQuery,
  useUpdateShiftMutation,
} from "../../Apis/shiftApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
const initialShiftData = {
  shiftName: "",
  startTime: "",
  endTime: "",
  shiftDuration: "",
  breakDuration: "",
  notes: "",
};

function ShiftUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shiftInputs, setShiftInputs] = useState(initialShiftData);
  const [loading, setLoading] = useState(false);
  const [createShift] = useCreateShiftMutation();
  const [updateShift] = useUpdateShiftMutation();
  const { data } = useGetShiftByIdQuery(id);
  const extractTimeFromDate = (dateTimeString: string | number | Date) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        shiftName: data.result.shiftName,
        startTime: extractTimeFromDate(data.result.startTime), 
        endTime: extractTimeFromDate(data.result.endTime),   
  shiftDuration: data.result.shiftDuration,
  breakDuration: data.result.breakDuration,
  notes: data.result.notes,
      };
      setShiftInputs(tempData);
    }
  }, [data]);

  const handleShiftInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const tempData = inputHelper(e, shiftInputs);
    setShiftInputs({
      ...tempData,
      startTime: tempData.startTime || "", 
      endTime: tempData.endTime || "",    
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("shiftName", shiftInputs.shiftName);
    formData.append("startTime", shiftInputs.startTime);
    formData.append("endTime", shiftInputs.endTime);
    formData.append("shiftDuration", shiftInputs.shiftDuration);
    formData.append("breakDuration", shiftInputs.breakDuration);
    formData.append("notes", shiftInputs.notes);
   
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateShift({ data: formData, id });
      toastNotify("Shift updated successfully", "success");
    } else {
      // create
      response = await createShift(formData);
      toastNotify("Shift created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/Shift/Shiftlist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">{id ? "Edit Shift" : "Add Shift"}</h3>

      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <div className="mb-3">
              <label htmlFor="shiftName" className="form-label">
                Shift Name
              </label>
              <input
                type="text"
                className="form-control"
                id="shiftName"
                placeholder="Enter Shift Name"
                required
                name="shiftName"
                value={shiftInputs.shiftName}
                onChange={handleShiftInput}
              />
            </div>

            <div className="mb-3">
  <label htmlFor="startTime" className="form-label">
    Start Time
  </label>
  <div className="form-control">
    <TimePicker
      id="startTime"
      required
      name="startTime"
      value={shiftInputs.startTime || ""}
      onChange={(time) => {
        console.log("Selected Time:", time);
        setShiftInputs({ ...shiftInputs, startTime: time || "" });
      }}
      format="h:mm a"
      clearIcon={null}
      disableClock={true}
    />
  </div>
</div>

<div className="mb-3">
  <label htmlFor="endTime" className="form-label">
    End Time
  </label>
  <div className="form-control">
    <TimePicker
      id="endTime"
      required
      name="endTime"
      value={shiftInputs.endTime || ""}
      onChange={(time) => setShiftInputs({ ...shiftInputs, endTime: time || "" })}
      format="h:mm a"
      clearIcon={null}
      disableClock={true}
    />
  </div>
</div>




            <div className="mb-3">
              <label htmlFor="shiftDuration" className="form-label">
                Shift Duration
              </label>
              <input
                type="text"
                className="form-control"
                id="shiftDuration"
                placeholder="Enter Shift Duration"
                required
                name="shiftDuration"
                value={shiftInputs.shiftDuration}
                onChange={handleShiftInput}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="breakDuration" className="form-label">
                Break Duration
              </label>
              <input
                type="text"
                className="form-control"
                id="breakDuration"
                placeholder="Enter Break Duration"
                required
                name="breakDuration"
                value={shiftInputs.breakDuration}
                onChange={handleShiftInput}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                className="form-control"
                id="notes"
                placeholder="Notes"
                required
                name="notes"
                value={shiftInputs.notes}
                onChange={handleShiftInput}
              />
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
                  onClick={() => navigate("/Shift/Shiftlist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Shift
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ShiftUpsert;
