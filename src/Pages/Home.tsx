import React, { useEffect, useState } from "react";
import { MainLoader } from '../Components/Page/Common';
import { inputHelper, toastNotify } from '../Helper';
import {
  useCreateApplicationUserMutation,
  useGetApplicationUserByIdQuery,
  useUpdateApplicationUserMutation,
} from "../Apis/applicationUserApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Storage/Redux/store";
import { userModel } from "../Interfaces";
import { SD_Roles } from "../Utility/SD";

const applicationUserData = {
  name: "",
  email: "",
};

function Home() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [applicationUserInputs, setApplicationUserInputs] = useState(applicationUserData);
  const [loading, setLoading] = useState(false);
  const [createApplicationUser] = useCreateApplicationUserMutation();
  const [updateApplicationUser] = useUpdateApplicationUserMutation();
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);
  
  const { data } = useGetApplicationUserByIdQuery(id);
  const showAddUserButton = userData.role !== SD_Roles.SuperAdmin;
 
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        name: data.result.name,
       
        email: data.result.email,
       
      };
      setApplicationUserInputs(tempData);
      setImageToDisplay(data.result.image);
      console.log("Image to display:", data.result.image);
    }
  }, [data]);
  
  const handleApplicationUserInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, applicationUserInputs);
    setApplicationUserInputs(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File Must be less then 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File Must be in jpeg, jpg or png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!imageToStore && !id) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("Name", applicationUserInputs.name);
    formData.append("Email", applicationUserInputs.email);
   
   
    if (imageToDisplay) formData.append("File", imageToStore);

    let response;

    if (id) {
      //update
      formData.append("Id", id);
      response = await updateApplicationUser({ data: formData, id });
      toastNotify("Profile updated successfully", "success");
    } 

    if (response) {
      setLoading(false);
      navigate("/applicationUser/applicationuserlist");
    }

    setLoading(false);
  };
  


  return (
    <>
    {userData.id ? (
      <div className="container border mt-5 p-5 bg-light">
        {loading && <MainLoader />}
      
        <div className="row">
          <div className="col-6">
            <h3 className="text-success">My Profile</h3>
          </div>
          
        </div>


        <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                required
                name="name"
                value={userData.fullName}
                onChange={handleApplicationUserInput}
              />
              <textarea
                className="form-control mt-3"
                placeholder="Enter EmailId"
                required
                name="email"
                value={userData.email}
                onChange={handleApplicationUserInput}
              ></textarea>





              <div className="row">
              {showAddUserButton && (
         
       
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-success form-control mt-3"
                    onClick={() =>
                      navigate("/applicationuser/applicationuserupsert/" + userData.id)
                    }
                  >
                    View Profile
                  </button>
                </div>
                 )}
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-success form-control mt-3"
                    onClick={() =>
                      navigate("/applicationuser/changepassword/" + userData.id)
                    }
                  >
                    Change Password
                  </button>
                </div>
                {showAddUserButton && ( 
          
                <div className="col-4">
                <button
              type="button"
              className="btn btn-success form-control mt-3"
              onClick={() => navigate("userShift/userShiftlist")}
            >
              View Shift
            </button>
                </div>
                     )}
              </div>
            </div>
           
          </div>
        </form>
      </div>
    ) : (
      <div>
       
      </div>
    )}
  </>
);
}

export default Home;
