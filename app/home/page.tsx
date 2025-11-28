"use client";

import MainContainer from "../components/Common/MainContainer";
import MainFooter from "../components/Common/MainFooter";
import BackgroundImage from "../components/Common/BackgroundImage";
import Image from "next/image";
import main_bg from "./../assets/main_container_bg.png";
import { useDisclosure } from "@heroui/react";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { BiMenu } from "react-icons/bi";
import BillingView from "../components/Billing/BillingView";
import logo from "../assets/logo_white.webp";
import Sidebar from "../components/Billing/Sidebar";
import UsersView from "../components/Billing/UsersView";
import { useState } from "react";
import RolesView from "../components/Billing/RolesView";
import PermissionsView from "../components/Billing/PermissionsView";
import PlansView from "../components/Billing/PlansView";

import { useRouter } from "next/navigation";

const Home = () => {
  useAuthCheck("/");
  const { isOpen, onOpenChange } = useDisclosure();
  const [billingVisible, setBillingVisible] = useState(true)
  const [userVisible, setUserVisible] = useState(false)
  const [rolesVisible, setRolesVisible] = useState(false)
  const [permissionsVisible, setPermissionsVisible] = useState(false)
  const [plansVisible, setPlansVisible] = useState(false)
  const router = useRouter();

  const changeView = (view:string) => {
    if (view == 'billings'){
      setBillingVisible(true)
      setUserVisible(false)
      setRolesVisible(false)
      setPermissionsVisible(false)
      setPlansVisible(false)
    }
    if (view == 'users'){
      setBillingVisible(false)
      setUserVisible(true)
      setRolesVisible(false)
      setPermissionsVisible(false)
      setPlansVisible(false)
    }
    if (view == 'roles'){
      setBillingVisible(false)
      setUserVisible(false)
      setRolesVisible(true)
      setPermissionsVisible(false)
      setPlansVisible(false)
    }
    if (view == 'permissions'){
      setBillingVisible(false)
      setUserVisible(false)
      setRolesVisible(false)
      setPermissionsVisible(true)
      setPlansVisible(false)
    }
    if (view == 'plans'){
      setBillingVisible(false)
      setUserVisible(false)
      setRolesVisible(false)
      setPermissionsVisible(false)
      setPlansVisible(true)
    }
  }

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden ">
      <BackgroundImage isLoginPage={false} />
      <Sidebar isOpen={isOpen} onOpenChange={onOpenChange} changeView={changeView}></Sidebar>

      <MainContainer src={main_bg} isLoginPage={false}>
        <div className="z-20 flex w-full flex-col items-center  justify-between text-darkPurple">
          <div className="flex h-[60px] w-full items-center gap-5 rounded-lg bg-[#251D3FCC] px-5">
            <div
              onClick={() => {
                onOpenChange()
              }}
            >
              <BiMenu color="white" size={20} />
            </div>
            <div className="hover:cursor-pointer" onClick={()=>{
              changeView('billings')
            }}><Image width={63} height={16} alt="" src={logo}></Image></div>
          </div>
          { billingVisible ? <BillingView></BillingView> :<></>}
          { userVisible ? <UsersView></UsersView> :<></>}
          { rolesVisible ? <RolesView></RolesView> : <></>}
          { permissionsVisible ? <PermissionsView></PermissionsView> : <></>}
          { plansVisible ? <PlansView></PlansView> : <></>}
          <MainFooter></MainFooter>
        </div>
      </MainContainer>
    </div>
  );
};

export default Home;
