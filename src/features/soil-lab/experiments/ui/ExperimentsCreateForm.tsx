import { FormProvider, useForm } from 'react-hook-form'
import type { TestExperimentsResponse } from '@/entities/soil-lab/experiments/ui/form/fields'
import GasPermeabilityCreateSection from '@/features/soil-lab/experiments/gasPermeability/create-section/ui/GasPermeabilityCreateSection'
import { experimentsAllDynamicSections } from '@/features/soil-lab/experiments/model/dynamic-sections'
import {
  experimentsCreateFormSchema,
  type ExperimentsCreateFormFields,
} from '@/features/soil-lab/experiments/model/schema'
import MoistureCreateSection from '@/features/soil-lab/experiments/moisture/create-section/ui/MoistureCreateSection'
import StrengthCreateSection from '@/features/soil-lab/experiments/strength/create-section/ui/StrengthCreateSection'
import { ExperimentsCreateBaseForm } from '@/features/soil-lab/experiments/ui/ExperimentsCreateBaseForm'
import { ExperimentsCreateFormKit } from '@/features/soil-lab/experiments/ui/formKit'
import { createDynamicEngine } from '@/shared/lib/zod/dynamic-resolver'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

type FormFields = ExperimentsCreateFormFields
const schema = experimentsCreateFormSchema

type ExperimentsFormProps = FormProps<FormFields, TestExperimentsResponse>

const Form = ExperimentsCreateFormKit

export function ExperimentsCreateForm({ defaultValues, responseData }: ExperimentsFormProps) {
  const { resolver, valueNormalizer, basePickParse } = createDynamicEngine<FormFields>(
    schema,
    experimentsAllDynamicSections,
  )

  const form = useForm<FormFields>({
    resolver,
    defaultValues,
  })

  return (
    <FormProvider {...form}>
      <FormLayout>
        <FormKitProvider value={Form}>
          <DynamicFieldsProvider
            sections={experimentsAllDynamicSections}
            responseData={responseData}
            valueNormalizer={valueNormalizer}
            basePickParse={basePickParse}
          >
            <ExperimentsCreateBaseForm responseData={responseData} />

            {/* Секции */}
            <MoistureCreateSection />
            <StrengthCreateSection />
            <GasPermeabilityCreateSection />
          </DynamicFieldsProvider>
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
