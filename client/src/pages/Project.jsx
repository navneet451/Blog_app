import React from "react";

const Project = () => {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Pojects</h1>
      <p className="text-md text-gray-500">
        Build fun and engaging projects while learning HTML, CSS, and
        JavaScript!
      </p>
      <p>
        Check out my another project here--&nbsp;&nbsp;
        <a
          href="https://airbnbproject-thh0.onrender.com"
          className="hover:text-blue-500 hover:underline"
          target="_block"
        >
          Airbnb clone
        </a>
      </p>
    </div>
  );
};

export default Project;
