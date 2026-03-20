"use client";

import { Input } from "./ui/input";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "./ui/button";

export function SearchInput () {
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("query") || "";
    const [search, setSearch] = useState<string>(initialQuery);
    const debounceTime = 500;

    useEffect(() => {
        
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            
            if(search) {
                params.set("query", search);
                params.set("page", "1")
            } else {
                params.delete("query");
            }
            
            router.replace(`${pathname}?${params.toString()}`);
        }, debounceTime)

        return () => {
            clearTimeout(handler)
        }
    }, [search, router]);

    const handleReset = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", "");
        params.set("query", "");
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`);
    }

    const handleDateSort = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", "date");
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`);
    }

    const handleCategorySort = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", "category");
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
    }

    const handleUnassignedFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", "assigned");
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-col 
        items-start gap-6">
            <div className="flex gap-6 max-w-2/3">
                <Input className="w-100"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search} name="search"
                    placeholder={"Search blogs..."} />
            </div>

            <div className="flex py-4 gap-4">
                <Button className="border-gray-500 
                border-2" 
                variant={"outline"}
                onClick={handleReset}                
                >All</Button>
                <Button onClick={handleDateSort}>Date</Button>
                <Button className="border-gray-500 
                border-2" 
                variant={"outline"}
                onClick={handleCategorySort}                
                >Category</Button>
                <Button onClick={handleUnassignedFilter}>Unassigned</Button>
            </div>
            {/* <p className="text-black 
            dark:text-white
            font-normal text-md
            ">Client component: {searchParams.get("query") || ""}</p> */}
        </div>
    )
}