// mappings.js

// Utility for My Applications: normalizes API fields for UI rendering
export function mapApplications(apiApplicationsArray) {
  return apiApplicationsArray.map(app => ({
    id: app.id,
    applicationId: app.application_id,
    type: app.type,
    origin: app.origin,
    destination: app.destination,
    fromDate: app.from_date,
    toDate: app.to_date,
    fromTime: app.from_time,
    toTime: app.to_time,
    purpose: app.purpose,
    travelMode: app.travel_mode,
    accommodationRequired: app.accommodation_required,
    transportRequired: app.transport_required,
    estimatedCost: app.estimated_cost,
    priority: app.priority,
    urgency: app.urgency,
    status: app.status,
    currentlyWith: app.currently_with,
    submittedDate: app.submitted_date,
    approvedDate: app.approved_date,
    rejectedDate: app.rejected_date,
    comments: app.comments,
    supportingDocuments: app.supporting_documents,
    fullName: app.full_name,
    employeeId: app.employee_id,
    department: app.department,
    requestNo: app.request_no,
    tourStatus: app.tour_status,
    completionStatus: app.completion_status     // Tour completion
    // Add more fields only as needed by your page render code
  }));
}

// Utility for My Tours: normalizes API fields for UI rendering
export function mapTours(apiToursArray) {
  return apiToursArray.map(tour => ({
    id: tour.id,
    requestNo: tour.request_no,
    route: tour.route,
    fromDate: tour.from_date,
    toDate: tour.to_date,
    purpose: tour.purpose,
    tourStatus: tour.tour_status,
    travelStatus: tour.travel_status,
    ticketsBooked: tour.tickets_booked,
    accommodationBooked: tour.accommodation_booked,
    transportArranged: tour.transport_arranged,
    completionStatus: tour.completion_status || 'not-uploaded',
    completionImage: tour.completion_image,
    completionImageName: tour.completion_image_name,
    completionDescription: tour.completion_description,
    completionLocation: tour.completion_location,
    verifiedBy: tour.verified_by,
    verifiedAt: tour.verified_at,
    submittedAt: tour.submitted_at,
    fullName: tour.full_name,
    employeeId: tour.employee_id,
    department: tour.department,
    applicationType: tour.application_type,
    priority: tour.priority,
    travelMode: tour.travel_mode
    // Add more fields only as needed by tour UI code
  }));
}
