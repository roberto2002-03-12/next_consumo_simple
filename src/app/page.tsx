/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { IPerson, IRandomPersonResult } from "./types/user.interface";

export default function Home() {
  const [ data, setData ] = useState<IPerson[]>([])
  const [ page, setPage ] = useState<number>(1)
  const [ filter, setFilter ] = useState<string>('')
  const [ isLoading, setIsLoading ] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)

    if(page >= 1)
      fetch(`https://randomuser.me/api/?page=${page}&results=50&seed=abc&inc=gender,name,email,login,picture`)
        .then(response => response.json())
        .then((responseData: IRandomPersonResult) => {
          console.log({responseData})

          const transformedData: IPerson[] = responseData.results.map(val => {
            return {
              fullName: `${ val.name.first } ${ val.name.last }`,
              gender: val.gender,
              username: val.login.username,
              email: val.email
            }
          })

          setData(transformedData)
          setIsLoading(false)
        })
        .catch(error => console.error('Error:', error));
  }, [ page ])

  const filteredData = useMemo(() => {
    const copyOfData = [ ...data ]

    return copyOfData.filter(val => val.fullName.toLowerCase().includes(filter.toLowerCase()))
  }, [ filter ])

  const handlePrevPage = () =>
    setPage(prev => prev - 1)

  const handleNextPage = () =>
    setPage(prev => prev + 1)

  const onChangeFilter = (e: ChangeEvent<HTMLInputElement>) =>
    setFilter(e.target.value)

  return (
    <div className="w-full mx-auto h-screen bg-slate-600 overflow-x-hidden">
      <div>
        <input
          type="text"
          placeholder="Ingresa"
          onChange={onChangeFilter}
          value={filter}
        />
      </div>
      {
        !isLoading &&
        (filter ? filteredData : data).map((val, index) => (
          <div key={index}>
            <p>{ val.fullName }</p>
            <p>{ val.username }</p>
            <p>{ val.email }</p>
          </div>
        ))
      }
      <footer className="bg-gray-950 text-white flex py-4 fixed bottom-0 w-full ">
        <button
          disabled={page === 1}
          onClick={handlePrevPage}
        >
          <ArrowLeft
            size="20"
            className="text-white"
          />
        </button>
        <div>
          { page }
        </div>
        <button
          onClick={handleNextPage}
        >
          <ArrowRight
            size="20"
            className="text-white"
          />
        </button>
      </footer>
    </div>
  );
}
