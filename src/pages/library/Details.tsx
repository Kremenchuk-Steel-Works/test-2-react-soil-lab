// import { useQuery } from '@tanstack/react-query'
// import { Clock, FileText, Hash, Pencil, Tag } from 'lucide-react'
// import { useParams } from 'react-router-dom'
// import { libraryQueryKeys } from '@/entities/library/services/keys'
// import { libraryService } from '@/entities/library/services/service.mock'
// import type { LibraryDetailResponse } from '@/entities/library/types/response.dto'
// import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

// export default function LibraryDetails() {
//   const { id } = useParams<{ id: string }>()

//   const {
//     data,
//     isLoading,
//     isError,
//     error: queryError,
//   } = useQuery<LibraryDetailResponse, Error>({
//     queryKey: libraryQueryKeys.detail(id!),
//     queryFn: () => libraryService.getById(id!),
//     enabled: !!id,
//   })

//   return (
//     <>
//       {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}
//       {!isLoading && !isError && data && (
//         <div className="bg-white p-6 dark:bg-gray-800">
//           <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Деталі</h2>

//           <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
//             {/* ID */}
//             <div className="sm:col-span-1">
//               <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-slate-400">
//                 <Hash className="mr-2 h-4 w-4" />
//                 ID Документа
//               </dt>
//               <dd className="mt-1 rounded bg-gray-50 px-2 py-1 font-mono text-sm text-gray-900 dark:bg-slate-700 dark:text-slate-300">
//                 {data.id}
//               </dd>
//             </div>

//             {/* File Name */}
//             <div className="sm:col-span-1">
//               <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-slate-400">
//                 <FileText className="mr-2 h-4 w-4" />
//                 Назва файлу
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
//                 {/* Можно обернуть в ссылку для скачивания, если есть URL */}
//                 <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
//                   {data.fileName}
//                 </a>
//               </dd>
//             </div>

//             {/* Full Name */}
//             <div className="sm:col-span-2">
//               <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Повна назва</dt>
//               <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.fullName}</dd>
//             </div>

//             {/* Keywords */}
//             <div className="sm:col-span-2">
//               <dt className="mb-2 flex items-center text-sm font-medium text-gray-500 dark:text-slate-400">
//                 <Tag className="mr-2 h-4 w-4" />
//                 Ключові слова
//               </dt>
//               <dd className="flex flex-wrap gap-2">
//                 {data.keywords.length > 0 ? (
//                   data.keywords.map((keyword, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
//                     >
//                       {keyword}
//                     </span>
//                   ))
//                 ) : (
//                   <span className="text-xs text-gray-500 dark:text-slate-400">Не вказано</span>
//                 )}
//               </dd>
//             </div>

//             {/* Divider */}
//             <div className="border-t border-gray-200 sm:col-span-2 dark:border-slate-700" />

//             {/* CreatedAt */}
//             <div className="sm:col-span-1">
//               <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-slate-400">
//                 <Clock className="mr-2 h-4 w-4" />
//                 Створено
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
//                 {new Date(data.createdAt).toLocaleString('uk-UA')}
//               </dd>
//             </div>

//             {/* UpdatedAt */}
//             <div className="sm:col-span-1">
//               <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-slate-400">
//                 <Pencil className="mr-2 h-4 w-4" />
//                 Оновлено
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
//                 {new Date(data.updatedAt).toLocaleString('uk-UA')}
//               </dd>
//             </div>
//           </dl>
//         </div>
//       )}
//     </>
//   )
// }
