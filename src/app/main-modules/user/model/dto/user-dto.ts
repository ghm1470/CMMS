import {UserType} from '../../../securityManagement/model/userType';
import {ImageModel} from '../../../../shared/model/ImageModel';
import {OrganizationDto} from '../../../basicInformation/organization/model/organizationDto';

export namespace UserDto {

    export class CreateUserMainInformation {
        name: string;
        family: string;
        nationalCode: string;
        image: DocumentFile;
        username: string;
        password: string;
        resetPasswordCode: string;
        messageId?: string;
        id?: string;
        userTypeId: string;
        userTypeName: string;
        active = true;

        // orgAndUserTypeList: OrgAndUserTypeListId[] = [];
    }


    export class OrgAndUserTypeListId {
        userTypeList: string [] = [];
        organizationId: string;
    }

    export class OrgAndUserTypeList {
        userTypeList: UserTypeList [] = [];
        organizationId: string;
        organizationName: string;
    }


    export class GetOneUserMainInformation {
        name: string;
        family: string;
        nationalCode: string;
        image: DocumentFile;
        username: string;
        password: string;
        resetPasswordCode: string;
        messageId?: string;
        id?: string;
        userTypeId: string;
        active = true;
        userTypeName: string;
        // orgAndUserTypeList: OrgAndUserTypeList[] = [];
    }


    export class UserSecondaryInformation {
        userId: string;
        birthDay: any;
        startWork: any;
        fatherName: string;
        userTypeId: string;
        userContact = new Contact();
    }


    export class GetList {
        family: string;
        fatherName: string;
        id: string;
        name: string;
        nationalCode: string;
        username: string;
        userTypeName: string;
    }


    export class Messaging {
        // id: string;
        userId: string;
        emailAllMessages = false;
        pushNotificationMessages = false;
        draft = false;
        pending = false;
        open = false;
        closed = false;
        allAssets = false;
        assetsIAmAssignedTo = false;
        assetsInTheFacilitiesThatIManage = false;

    }

    export class UsersAssignedToUserDTO {
        name: string;
        family: string;
        userTypeName: string;
        userTypeId: string;
        orgName: string;
        orgId: string;
        id: string;
    }

    export class GetUserWithUserType {
        id: string;
        name: string;
        family: string;
        userTypeId: string;
        userTypeName: string;
        nameForShow: string;
    }

    export class UsersAssignedToGroupDTO {
        userTypeId: string;
        userTypeName: string;
    }

    export class Create {
        requestDate: Date;
        id: string;
        name: string;
        family: string;
        fatherName: string;
        nationalCode: string;
        birthDay: any;
        startWork: any;
        username: string;
        password: string;
        userType: UserType = new UserType();
        userTypeId: string;
        organId: string;
        userContact: Contact = new Contact();
        image: ImageModel = new ImageModel();
        imageUrl: string;
        userTypeName: string;
        childUsers: string[];
        documentFile: DocumentFile;
        certification: Certification;
    }

    export class GetAllByFilter {
        id: string;
        username: string;
        name: string;
        family: string;
        userTypeId: string;
    }

    export class GetAllTow {
        name: string;
        family: string;
        id: string;
        userTypeName: string;
    }

    export class GetAllTree {
        family: string;
        id: string;
        name: string;
        orgAndUserTypeNameList: Org[] = [];
        userTypeList: UserTypeList[] = [];
    }

    export class Org {
        organizationId: string;
        organizationName: string;
    }

    export class Contact {
        id: number;
        phoneNumber: string;
        email: string;
        telegramId: string;
        address: string;
    }


    export class Certification {
        id: string;
        name: string;
        description: string;
        validFrom: any;
        validFor: any;
        userId: string;
        certificateDocumentList: DocumentFile[] = [];
    }

    export class DocumentFile {
        id: string;
        fileByte: any;
        fileName: string;
        fileContentType: string;
        companyId: string;
        extraId: string;
        userId: string;
    }


    export class UserChild {
        userId: string;
        // parentUserId: string[] = [];
        parentUserId: string;
    }

    export class GetAllUserChild {
        family: string;
        id: string;
        name: string;
        userTypeName: string [] = [];
    }

    export class UserSelectList {
        userTypeName: string;
        userTypeId: string;
    }

    export class UserTypeList {
        userTypeName: string;
        userTypeId: string;

    }

}
