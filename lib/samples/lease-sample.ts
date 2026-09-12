// Bundled sample lease for the onboarding walkthrough (ticket 07) — the
// secondary example alongside FREELANCE_CONTRACT_SAMPLE (see
// freelance-contract-sample.ts for why this lives here instead of
// tests/fixtures/). Fed directly into the same documentText -> /home/analyze
// flow a real upload uses.
//
// Contains a representative subset of lease-relevant starter red-line
// categories: personal_guarantee, fee_escalator, early_termination, and
// auto_renewal. Each clause is written to be specific enough that its exact
// sentence can be quoted as a flag's source, per CLAUDE.md's citation rule.

export const LEASE_SAMPLE = `COMMERCIAL LEASE AGREEMENT

This Commercial Lease Agreement ("Lease") is made as of April 1, 2026, between Meridian Property Group LLC ("Landlord") and the undersigned tenant entity ("Tenant"), for the premises located at 214 Harbor Row, Suite 3B ("Premises").

1. Term
The initial term of this Lease is three (3) years, commencing May 1, 2026 and ending April 30, 2029 ("Term").

2. Base Rent and Escalation
Tenant shall pay Base Rent of $4,200 per month, due on the first of each month. Base Rent shall increase automatically each year on the anniversary of the Commencement Date by eight percent (8%), compounding annually, regardless of prevailing market rates in the surrounding area.

3. Security Deposit
Tenant shall pay a security deposit of $8,400 upon signing, refundable within forty-five (45) days after the Premises are vacated, less any deductions for damage beyond normal wear and tear.

4. Use of Premises
Tenant shall use the Premises solely for general office and retail purposes consistent with applicable zoning and shall not use the Premises for any unlawful purpose.

5. Renewal
This Lease shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least one hundred eighty (180) days prior to the expiration of the then-current Term.

6. Early Termination
Should Tenant terminate this Lease prior to the end of the Term for any reason, Tenant shall immediately owe Landlord an early termination fee equal to the greater of (a) six (6) months' Base Rent or (b) the total remaining rent due for the balance of the Term.

7. Maintenance and Repairs
Landlord is responsible for structural repairs and major building systems. Tenant is responsible for routine maintenance of the interior of the Premises, including light fixtures and interior fixtures installed by Tenant.

8. Personal Guarantee
The individual signing below on behalf of Tenant agrees to personally and unconditionally guarantee full and timely payment and performance of all of Tenant's obligations under this Lease, including any renewal term, and this guarantee shall survive the termination or assignment of the Lease.

9. Insurance
Tenant shall maintain commercial general liability insurance in an amount no less than $1,000,000 per occurrence, naming Landlord as an additional insured.

10. Default
If Tenant fails to pay rent within five (5) days of the due date, Landlord may declare Tenant in default and pursue all remedies available under this Lease and applicable law, including acceleration of all remaining rent due for the Term.

11. General
This Lease is governed by the laws of the state in which the Premises are located and constitutes the entire agreement between the parties regarding the Premises.

IN WITNESS WHEREOF, the parties have executed this Lease as of the date first written above.

Meridian Property Group LLC                       Tenant
By: _____________________                          By: _____________________
Name: R. Solano, Managing Member                    Name: _____________________
Date: _____________________                         Date: _____________________
                                                     Guarantor: _____________________`;
