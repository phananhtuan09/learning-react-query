import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Students as StudentsType } from 'types/students.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryString } from 'utils/utils'
import classNames from 'classnames'
import { toast } from 'react-toastify'

const LIMIT = 10

export default function Students() {
  // const [students, setStudents] = useState<StudentsType>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  const queryString: { page?: string } = useQueryString()
  const queryClient = useQueryClient()

  const page = Number(queryString.page) || 1

  const studentsQuery = useQuery({
    queryKey: ['students', page],
    queryFn: async () => {
      try {
        setIsLoading(true)
        const res = await getStudents(page, 10)
        return res
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      } finally {
        setIsLoading(false)
      }
    },
    retry: 0
  })

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number | string) => {
      try {
        const res = await deleteStudent(id)
        toast.success(`Xoá thành công user có id là ${id}`)
        queryClient.invalidateQueries({
          queryKey: ['students', page]
        })
        return res
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      }
    }
    // onMutate: (variable) => {
    //   setIsLoading(true)
    // },
    // onSuccess: (_, id) => {
    //   toast.success(`Xoá thành công user có id là ${id}`)
    // },
    // onSettled: () => {
    //   setIsLoading(false)
    // }
  })

  const totalStudentsCount = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentsCount / LIMIT)

  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id)
  }

  const handlePrefetchStudent = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['student', String(id)],
      queryFn: () => getStudent(String(id))
    })
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className='mt-6'>
        <Link
          to='/students/add'
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
        >
          Add Student
        </Link>
      </div>

      {isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery.data?.data?.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                      // onMouseEnter={() => handlePrefetchStudent(student.id)}
                    >
                      <td className='py-4 px-6'>{student.id}</td>
                      <td className='py-4 px-6'>
                        <img src={student.avatar} alt='student' className='h-5 w-5' />
                      </td>
                      <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                        {student.last_name}
                      </th>
                      <td className='py-4 px-6'>{student.email}</td>
                      <td className='py-4 px-6 text-right'>
                        <Link
                          to={`/students/${student.id}`}
                          className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                        >
                          Edit
                        </Link>
                        <button
                          className='font-medium text-red-600 dark:text-red-500'
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                      Previous
                    </span>
                  ) : (
                    <Link
                      className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300   py-2 px-3 leading-tight hover:bg-gray-100  hover:text-gray-700',
                            {
                              'bg-gray-100 text-gray-700': isActive,
                              'bg-white text-gray-500': !isActive
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className=' cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                      Next
                    </span>
                  ) : (
                    <Link
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
