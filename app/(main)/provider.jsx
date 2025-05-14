
"use client"

import { SidebarProvider, SlidebarProvider } from '@/components/ui/sidebar';
import React,{useEffect} from 'react';
import AppSidebar from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import { useAuthContext } from '../provider';
import { useRouter } from 'next/navigation';

function DashboardProvider({children}) {

  const {user}=useAuthContext();
  const router=useRouter();
  useEffect(()=>{
    user&&CheckUserAuthenticated();

  },[user])

  const CheckUserAuthenticated=()=>{
    if(!user){
      router.replace('/');
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
    <div className="w-full">
      <AppHeader />
        {children}
        </div> 
    </SidebarProvider>    
  )
}

export default DashboardProvider;
