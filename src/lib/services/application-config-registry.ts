import {
  internationalEinApplication,
  itinApplication,
  ukAddressApplication,
  ukCorporateTaxFilingApplication,
  ukDirectorIdVerificationApplication,
  ukLtdApplication,
  usaLlcApplication,
} from "./application-config";
import type { ApplicationConfig } from "./application-config-types";
import { ukConfirmationStatementApplication } from "./confirmation-statement-application";
import { ukVatRegistrationApplication } from "./vat-registration-application";
import { ukVatFilingApplication } from "./vat-filing-application";
import {
  pakLlpRegistrationApplication,
  pakPrivateCompanyRegistrationApplication,
  pakSoleBusinessRegistrationApplication,
} from "./pak-business-registration-application";
import {
  pakBecomeFilerApplication,
  pakBusinessReturnApplication,
  pakDnfbpCertificateApplication,
  pakNtnRegistrationApplication,
  pakPsebApplication,
  pakPswApplication,
  pakSalaryReturnApplication,
} from "./pak-taxation-application";

export const applicationConfigs: Readonly<Record<string, ApplicationConfig>> = {
  [usaLlcApplication.serviceSlug]: usaLlcApplication,
  [itinApplication.serviceSlug]: itinApplication,
  [internationalEinApplication.serviceSlug]: internationalEinApplication,
  [ukLtdApplication.serviceSlug]: ukLtdApplication,
  [ukDirectorIdVerificationApplication.serviceSlug]: ukDirectorIdVerificationApplication,
  [ukAddressApplication.serviceSlug]: ukAddressApplication,
  [ukCorporateTaxFilingApplication.serviceSlug]: ukCorporateTaxFilingApplication,
  [ukConfirmationStatementApplication.serviceSlug]: ukConfirmationStatementApplication,
  [ukVatRegistrationApplication.serviceSlug]: ukVatRegistrationApplication,
  [ukVatFilingApplication.serviceSlug]: ukVatFilingApplication,
  [pakSoleBusinessRegistrationApplication.serviceSlug]: pakSoleBusinessRegistrationApplication,
  [pakPrivateCompanyRegistrationApplication.serviceSlug]: pakPrivateCompanyRegistrationApplication,
  [pakLlpRegistrationApplication.serviceSlug]: pakLlpRegistrationApplication,
  [pakNtnRegistrationApplication.serviceSlug]: pakNtnRegistrationApplication,
  [pakBecomeFilerApplication.serviceSlug]: pakBecomeFilerApplication,
  [pakSalaryReturnApplication.serviceSlug]: pakSalaryReturnApplication,
  [pakBusinessReturnApplication.serviceSlug]: pakBusinessReturnApplication,
  [pakDnfbpCertificateApplication.serviceSlug]: pakDnfbpCertificateApplication,
  [pakPsebApplication.serviceSlug]: pakPsebApplication,
  [pakPswApplication.serviceSlug]: pakPswApplication,
};

export function getApplicationConfig(serviceSlug: string): ApplicationConfig | undefined {
  return applicationConfigs[serviceSlug];
}
