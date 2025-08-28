// import { useQuery } from '@tanstack/react-query'
// import { useNavigate, useParams } from 'react-router-dom'
// import LibraryForm from '@/entities/library/forms/form'
// import type { LibraryFormFields } from '@/entities/library/forms/schema'
// import { libraryQueryKeys } from '@/entities/library/services/keys'
// import { libraryService } from '@/entities/library/services/service.mock'
// import type { LibraryDetailResponse } from '@/entities/library/types/response.dto'
// import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

// export default function LibraryUpdate() {
//   const navigate = useNavigate()
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

//   const handleSubmit = async (formData: LibraryFormFields) => {
//     navigate('..')
//     return formData
//   }

//   // Адаптируем данные под форму
//   function mapToFormDefaults(obj: LibraryDetailResponse): Partial<LibraryFormFields> {
//     return {
//       ...obj,
//       keywords: (obj.keywords.length > 0 ? obj.keywords : ['']) as [string, ...string[]],
//     }
//   }

//   return (
//     <>
//       {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

//       {!isLoading && !isError && data && (
//         <div className="flex flex-wrap gap-x-2 gap-y-2">
//           <div className="w-full">
//             <LibraryForm
//               onSubmit={handleSubmit}
//               defaultValues={mapToFormDefaults(data)}
//               submitBtnName="Оновити"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
