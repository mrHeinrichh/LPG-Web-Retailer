"use client";
import { Button, InputField, Navbar } from "@/components/";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import { API_URL } from "@/env";
import Image from "next/image";
import { post } from "@/config";
import { useAuthStore } from "@/states";

export default function Home() {
  const router = useRouter();
  const { user, authenticate } = useAuthStore() as any;

  const [image, setimage] = useState<null | string>(null);
  const [doeImage, setDoeImage] = useState<null | string>(null);
  const [businessPermitImage, setBusinessPermitImage] = useState<null | string>(null);
  const [fireSafetyPermitImage, setFireSafetyPermitImage] = useState<null | string>(null);
  const [agreementImage, setAgreementImage] = useState<null | string>(null);

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]); // Include 'router' in the dependency array

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const fileChange = async (event: any) => {
    const form = new FormData();
    form.append("image", event.target.files[0]);
    const { data } = await post<FormData>("upload/image", form);
    console.log("File Change Response:", data); // Add this line for debugging
    if (data.status === "success") {
      setimage(data.data[0]?.path ?? "");
    }
  };
  
  const fileChange1 = async (event: any) => {
    const form = new FormData();
    form.append("image", event.target.files[0]);
    const { data } = await post<FormData>("upload/image", form);
    if (data.status === "success") {
      setDoeImage(data.data[0]?.path ?? "");
    }
  };

  const fileChange2 = async (event: any) => {
    const form = new FormData();
    form.append("image", event.target.files[0]);
    const { data } = await post<FormData>("upload/image", form);
    if (data.status === "success") {
      setBusinessPermitImage(data.data[0]?.path ?? "");
    }
  };

  const fileChange3 = async (event: any) => {
    const form = new FormData();
    form.append("image", event.target.files[0]);
    const { data } = await post<FormData>("upload/image", form);
    if (data.status === "success") {
      setFireSafetyPermitImage(data.data[0]?.path ?? "");
    }
  };

  const fileChange4 = async (event: any) => {
    const form = new FormData();
    form.append("image", event.target.files[0]);
    const { data } = await post<FormData>("upload/image", form);
    if (data.status === "success") {
      setAgreementImage(data.data[0]?.path ?? "");
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await post(`users`, {
        ...formData,
        image,  // Include the 'image' field in the request
        doe: doeImage,
        businessPermit: businessPermitImage,
        fireSafetyPermit: fireSafetyPermitImage,
        agreement: agreementImage,
        __t: "Retailer",
      });
  
      console.log(data);
      if (data.status === "success") router.push("/");
    } catch (error) {
      console.error("Error adding retailers:", error);
    }
  };
  

  const handlePrivacy = async (event: any) => {
    console.log(event.target.value);
  };

  return (
    <main>
      <Navbar></Navbar>
      <main className={style.container}>
        <form className={style.form}>
          <div className="col-span-2">
            <h3 className="font-bold text-lg">Create your account</h3>
          </div>
          {image ? (
            <Image
              src={image ?? ""}
              width={150}
              height={150}
              alt={image ?? ""}
            ></Image>
          ) : (
            <></>
          )}
          <div className="col-span-2">
            <InputField
              type="file"
              placeholder="Upload Image"
              onChange={fileChange}
            />
          </div>
          <InputField
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
          <InputField
            name="contactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
          />
          <div className="col-span-2">
            <InputField
              name="address"
              placeholder="Address"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <InputField
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <InputField
              type="file"
              placeholder="Upload DOE License"
              onChange={fileChange1}
            />
          </div>
          <div className="col-span-2">
            <InputField
              type="file"
              placeholder="Upload Business Permit"
              onChange={fileChange2}
            />
          </div>
          <div className="col-span-2">
            <InputField
              type="file"
              placeholder="Upload Fire Safety Certificate"
              onChange={fileChange3}
            />
          </div>
          <div className="col-span-2">
            <InputField
              type="file"
              placeholder="Agreement"
              onChange={fileChange4}
            />
          </div>
          {" "}
          <div className="col-span-2 flex gap-2">
            <input type={"checkbox"} onChange={handlePrivacy}></input>
            <p>I accept the terms and agreements of data privacy</p>
          </div>
          <div className="col-span-2">
            <Button type="button" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      </main>
    </main>
  );
}
