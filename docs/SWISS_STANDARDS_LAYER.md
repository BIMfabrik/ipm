# IPM Swiss Standards Layer

## Product proposition

IPM should not become a larger static graph or a copy of existing standards catalogues. It should become the execution layer between:

1. owner and operator outcomes,
2. selected BIM use cases,
3. information requirements,
4. Swiss and international standards,
5. machine-checkable IFC / IDS rules,
6. project responsibility and evidence,
7. accepted operational information.

The graph explains the system. The workbench configures and executes it.

## Current beta

The `/standards/` route provides:

- a curated reference catalogue of Swiss and openBIM layers;
- four starting templates for owner information ordering, BIM2FM, model quality and cost planning;
- project metadata and applicability assessment;
- implementation states from `Not assessed` to `Verified`;
- responsible-person and evidence fields;
- readiness scoring;
- category and status filters;
- local browser persistence;
- JSON import and export;
- explicit access labels for open, service, guidance, request and licensed sources.

This is a functional prototype, not a normative compliance certificate.

## Target information model

### Core entities

- Organisation outcome
- Project objective
- Decision
- Use case
- Process
- Exchange
- Information requirement
- LOIN requirement
- Object / asset type
- Classification
- IFC entity and predefined type
- Property and allowed value
- Document requirement
- IDS specification
- Role and actor
- Milestone
- Delivery
- Validation result
- Evidence
- Exception
- Approval
- Operational system and field
- Standard reference
- Version

### Important relations

- outcome `requires` decision
- decision `is supported by` use case
- use case `contains` process
- process `requires` exchange
- exchange `contains` information requirement
- information requirement `has LOIN at` milestone
- requirement `applies to` asset / IFC entity / classification
- requirement `is encoded by` IDS specification
- role `produces / reviews / approves / receives` delivery
- validation `tests` requirement
- evidence `proves` validation or approval
- operational field `is populated by` accepted requirement
- standard reference `governs / guides / defines` entity or relation

## Standards strategy

### Implement directly

Open standards and open services can be integrated deeply:

- IFC schema references
- IDS schema generation and validation
- bSDD identifiers and terminology
- buildingSMART Use Case Management links or authorised API/imports

### Connect under licence or authorisation

Do not copy protected source datasets into the public repository. Use connectors, references and customer-provided licensed imports for:

- SN / EN / ISO norm content
- CRB eBKP datasets and IFC rule sets
- Basis-AIR source files when their distribution terms require controlled access
- customer-specific AIR, EIR, BEP and FM catalogues

The public catalogue contains metadata and implementation guidance only.

## Differentiation

Existing parties already provide norms, publications, use-case libraries, classifications or checking formats. IPM should not compete with each source separately. Its value is the connected project execution layer:

- configure a Swiss baseline for one project;
- show why every requirement exists;
- distinguish normative, recommended and project-specific content;
- assign producer, reviewer, approver and recipient;
- derive testable IFC / IDS rules;
- store delivery evidence and exceptions;
- measure readiness by use case, milestone, discipline and operational process;
- generate stakeholder-specific views from one structured source.

## Delivery roadmap

### Phase 1 — Reference and assessment

Status: beta implemented.

- standards catalogue
- project templates
- applicability and maturity assessment
- evidence notes
- JSON exchange

### Phase 2 — Persistent project workspace

- authentication and organisations
- PostgreSQL project storage
- project members and permissions
- version history and audit log
- comments, review and approval workflow
- evidence attachments and links
- saved filters and stakeholder views

### Phase 3 — Structured requirement authoring

- outcomes, decisions and use-case selection
- AIR / EIR requirement records
- LOIN editor by milestone and discipline
- explicit RACI-style relations
- asset, classification and FM-system mappings
- reusable client and project libraries

### Phase 4 — OpenBIM execution

- IFC entity/property browser
- bSDD URI lookup and mappings
- IDS draft generation
- official-schema validation
- independent IDS checker integration
- IFC upload and validation results
- issue and evidence generation

AI may assist drafting and mapping, but generated IDS must pass deterministic validation and expert approval before it becomes an accepted project rule.

### Phase 5 — Licensed Swiss connectors

- controlled Basis-AIR import
- CRB eBKP–IFC connector/import
- customer catalogues and existing AIA/EIR import
- mapping review and version comparison
- source licence and provenance metadata

### Phase 6 — Product intelligence

- suggest relevant use cases from project profile
- detect missing links and unclear responsibility
- compare requirements against organisational templates
- impact analysis when a requirement changes
- readiness and risk explanations
- generated project brief, responsibility matrix, IDS package and handover plan

## Recommended application architecture

- Frontend: current static prototype evolved into a component-based application
- Database: PostgreSQL with explicit versioned entity/relation tables
- Authentication: organisation and project memberships
- File storage: evidence, source imports and validation reports
- Graph: derived view of the same database, not a separate dataset
- Standards connectors: isolated adapters with provenance and licence controls
- Validation worker: IfcOpenShell / IDS schema and independent checking services
- Export: JSON, CSV/XLSX, IDS, human-readable requirement schedules and audit reports

## Product rule

Every visible graph connection must be backed by a structured record, source, owner and status. Every generated requirement must remain traceable to a purpose and an acceptance decision.
