// Bundled sample document for the onboarding walkthrough (ticket 07). This
// is real product content shown to first-time users, not a test fixture —
// keep it out of tests/fixtures/. It is fed directly into the same
// documentText -> /home/analyze flow a real upload uses; see
// app/home/home-client.tsx's runAnalysis.
//
// Deliberately contains a representative subset (5 of 7) of the starter
// red-line categories from lib/red-lines/starter-red-lines.ts: scope_creep,
// ip_assignment, non_compete, indemnification, and arbitration. Each clause
// below is written to be specific enough that its exact sentence can be
// quoted as a flag's source, per CLAUDE.md's citation rule.

export const FREELANCE_CONTRACT_SAMPLE = `INDEPENDENT CONTRACTOR SERVICES AGREEMENT

This Independent Contractor Services Agreement ("Agreement") is entered into as of March 3, 2026, between Alderwood Creative Studio LLC ("Client"), and the undersigned individual ("Contractor"), collectively the "Parties."

1. Services
Contractor will design and build a marketing website for Client, including up to five (5) template pages, as described in Exhibit A. Contractor agrees to complete the Project and any related tasks reasonably requested by Client from time to time, at no additional charge, until Client is fully satisfied with the deliverables. Client will provide brand assets and content within a reasonable time after signing.

2. Fees and Payment
Client will pay Contractor a total fee of $9,500, payable in three installments: 40% upon signing, 30% upon delivery of the first draft, and 30% upon final delivery. Invoices are due within thirty (30) days of receipt.

3. Ownership of Work Product
Upon creation, all work product, ideas, and materials developed by Contractor in connection with the Project, whether or not part of the final deliverables, automatically become the sole and exclusive property of Client, including work product Contractor may wish to reuse in future engagements. Contractor waives any and all moral rights in the work product to the fullest extent permitted by law.

4. Confidentiality
Contractor agrees to keep confidential all non-public information disclosed by Client during the course of the Project and not to disclose it to any third party without Client's prior written consent.

5. Non-Solicitation and Non-Compete
For a period of twenty-four (24) months following the termination of this Agreement, Contractor shall not, directly or indirectly, provide website design, branding, or related creative services to any business operating within the same industry as Client anywhere in the United States. Contractor acknowledges this restriction is reasonable given the nature of the Project.

6. Indemnification
Contractor shall indemnify, defend, and hold harmless Client, its officers, employees, and affiliates from and against any and all claims, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or relating to Contractor's performance of the Services, regardless of whether such claims are caused in whole or in part by Client's own negligence.

7. Term and Termination
This Agreement begins on the effective date above and continues until the Project is delivered and accepted. Either party may terminate for convenience with fourteen (14) days' written notice, in which case Contractor will be paid for work completed through the termination date.

8. Independent Contractor Status
Contractor is an independent contractor and not an employee, partner, or agent of Client. Contractor is responsible for its own taxes, insurance, and benefits.

9. Dispute Resolution
Any dispute arising out of or relating to this Agreement shall be resolved exclusively through binding individual arbitration administered by JAMS under its Streamlined Arbitration Rules, and each party waives any right to bring or participate in a class, collective, or representative action against the other.

10. General
This Agreement is governed by the laws of the state in which Client is headquartered. If any provision is found unenforceable, the remaining provisions remain in full effect. This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

Alderwood Creative Studio LLC                    Contractor
By: _____________________                         By: _____________________
Name: J. Alderwood, Managing Member               Name: _____________________
Date: _____________________                        Date: _____________________`;
