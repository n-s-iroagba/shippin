import { StageCreationDto } from "../dto/creationDtos";
import { ValidationError, ValidationErrorItem } from "../utils/error/errorClasses";


  export function validateStageCreationDto(data: Partial<StageCreationDto>): ValidationError |void {
    const errors: ValidationErrorItem[] = [];
      if (data.carrierNote !== undefined && !data.carrierNote?.trim()) {
    errors.push({
      field: "carrier note",
      message: "Carrier note name cannot be empty",
      value: data.carrierNote
    })
  }

  if (data.dateAndTime !== undefined && !data.dateAndTime) {
    errors.push({
      field: "dateAndTime",
      message: "dateAndTime cannot be empty",
      value: data.dateAndTime
    })
  }

  if (data.title !== undefined && !data.title?.trim()) {
    errors.push({
      field: "title",
      message: "title cannot be empty",
      value: data.title
    })
  }

  if (data.title !== undefined && !data.title?.trim()) {
    errors.push({
      field: "title",
      message: "title cannot be empty",
      value: data.title
    })
  }

  if (data.location !== undefined && !data.location?.trim()) {
    errors.push({
      field: "location",
      message: "Recipient name cannot be empty",
      value: data.location
    })



  if (data.longitude !== undefined && !data.longitude) {
    errors.push({
      field: "longitude",
      message: "longitude cannot be empty",
      value: data.longitude
    })
  }

  if (data.latitude !== undefined && !data.latitude) {
    errors.push({
      field: "latitude",
      message: "Recipient name cannot be empty",
      value: data.latitude
    })
  }
  }


 

    if (errors.length) throw new ValidationError(errors, 'create shipment stage validation error occured ')
    }
  /**
   * Validates payment receipt data
   */
  export function validatePaymentReceipts(receipts: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (receipts !== null && receipts !== undefined) {
      if (!Array.isArray(receipts)) {
        errors.push('Payment receipts must be an array');
      } else {
        receipts.forEach((receipt, index) => {
          if (!(receipt instanceof Buffer) && typeof receipt !== 'string') {
            errors.push(`Payment receipt at index ${index} must be a Buffer or base64 string`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates coordinate values
   */
  export function validateCoordinates(longitude: number, latitude: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (typeof longitude !== 'number' || isNaN(longitude)) {
      errors.push('Longitude must be a valid number');
    } else if (longitude < -180 || longitude > 180) {
      errors.push('Longitude must be between -180 and 180');
    }

    if (typeof latitude !== 'number' || isNaN(latitude)) {
      errors.push('Latitude must be a valid number');
    } else if (latitude < -90 || latitude > 90) {
      errors.push('Latitude must be between -90 and 90');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates payment status transition
   */
  export function validatePaymentStatusTransition(
    currentStatus: string, 
    newStatus: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const validStatuses = ['NO_PAYMENT_REQUIRED', 'UNPAID', 'PENDING', 'PAID'];

    if (!validStatuses.includes(newStatus)) {
      errors.push('Invalid payment status');
      return { isValid: false, errors };
    }

    // Define valid transitions
    const validTransitions: Record<string, string[]> = {
      'NO_PAYMENT_REQUIRED': ['UNPAID'], // Can change to require payment
      'UNPAID': ['PENDING', 'PAID', 'NO_PAYMENT_REQUIRED'],
      'PENDING': ['PAID', 'UNPAID'],
      'PAID': [] // Generally shouldn't change from PAID
    };

    if (currentStatus !== newStatus && !validTransitions[currentStatus]?.includes(newStatus)) {
      errors.push(`Invalid payment status transition from ${currentStatus} to ${newStatus}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }


