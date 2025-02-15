import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "react-toastify";
// import { Cloudinary } from "@cloudinary/url-gen";
// import { AdvancedImage } from "@cloudinary/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState();
  const [imageUploadProgress, setImageUploadProgress] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    setImageUploadProgress(true);
    if (!file) {
      toast.error("Please select an image");
      setImageUploadProgress(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_KEY); 

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        formData
      );

      // console.log("Cloudinary Response:", data);
      toast.success("Image upload success!");
      setImageUploadProgress(false);
      setImageURL(data.secure_url); // Set the image URL state
    } catch (error) {
      toast.error("Image couldn't be uploaded");
      setImageUploadProgress(false);
      console.error("Upload Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create`, {
        title: title,
        description: description,
        category: category,
        imageURL: imageURL,
      }, {
        withCredentials: true,
      });
      console.log(res);
      toast.success(res.data.message); 
      navigate(`/post/${res.data.savedPost._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setTitle("");
      setDescription("");
      setCategory("");
      setFile("");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            className="flex-1"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Select onChange={(e) => setCategory(e.target.value)} value={category}>
            <option value="uncategorized">Select a category</option>
            <option value="Javascript">Javascript</option>
            <option value="Java">Java</option>
            <option value="React.js">React.js</option>
            <option value="Next.js">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            // value={file}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? <p>Uploading...</p> : "Upload Image"}
          </Button>
        </div>
        {imageURL && (
          <img className="rounded-lg" src={imageURL} alt="Uploaded image" />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setDescription(value)}
          value={description}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
