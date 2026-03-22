import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat8 "mo:core/Nat8";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // User Profile Model
  public type UserProfile = {
    name : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student Model
  public type Student = {
    id : Text;
    name : Text;
    fatherName : Text;
    motherName : Text;
    dateOfBirth : Text;
    caste : Text;
    mobileNumber : Text;
    aadhaarNumber : Text;
    penNumber : Text;
    photo : Storage.ExternalBlob;
    address : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  module Student {
    public func compare(s1 : Student, s2 : Student) : Order.Order {
      Text.compare(s1.name, s2.name);
    };
  };

  // Attendance Model
  public type AttendanceStatus = { #present; #absent };

  public type Attendance = {
    id : Text;
    studentId : Text;
    date : Text; // YYYY-MM-DD
    status : AttendanceStatus;
    note : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Fee Model
  public type Fee = {
    id : Text;
    studentId : Text;
    date : Text; // YYYY-MM-DD
    amount : Text;
    paymentMode : Text;
    note : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Monthly Test Model
  public type MonthlyTest = {
    id : Text;
    studentId : Text;
    month : Text; // YYYY-MM
    subject : Text;
    marks : Text;
    remark : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Exam Model
  public type Exam = {
    id : Text;
    studentId : Text;
    examName : Text;
    examDate : Text; // YYYY-MM-DD or session
    subject : Text;
    marks : Text;
    remark : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Storage
  let students = Map.empty<Text, Student>();
  let attendanceRecords = Map.empty<Text, Attendance>();
  let feeRecords = Map.empty<Text, Fee>();
  let monthlyTestRecords = Map.empty<Text, MonthlyTest>();
  let examRecords = Map.empty<Text, Exam>();

  // Student CRUD
  public shared ({ caller }) func createStudent(
    name : Text,
    fatherName : Text,
    motherName : Text,
    dateOfBirth : Text,
    caste : Text,
    mobileNumber : Text,
    aadhaarNumber : Text,
    penNumber : Text,
    photo : Storage.ExternalBlob,
    address : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create students");
    };
    let id = mobileNumber // Use mobile number as unique ID
    ;
    let student : Student = {
      id;
      name;
      fatherName;
      motherName;
      dateOfBirth;
      caste;
      mobileNumber;
      aadhaarNumber;
      penNumber;
      photo;
      address;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    students.add(id, student);
    id;
  };

  public shared ({ caller }) func updateStudent(
    id : Text,
    name : Text,
    fatherName : Text,
    motherName : Text,
    dateOfBirth : Text,
    caste : Text,
    mobileNumber : Text,
    aadhaarNumber : Text,
    penNumber : Text,
    photo : Storage.ExternalBlob,
    address : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update students");
    };
    let existing = switch (students.get(id)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
    let updated : Student = {
      id;
      name;
      fatherName;
      motherName;
      dateOfBirth;
      caste;
      mobileNumber;
      aadhaarNumber;
      penNumber;
      photo;
      address;
      createdAt = existing.createdAt;
      updatedAt = Time.now();
    };
    students.add(id, updated);
  };

  public query ({ caller }) func getStudent(id : Text) : async Student {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view student details");
    };
    switch (students.get(id)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };

  public shared ({ caller }) func deleteStudent(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete students");
    };
    if (not students.containsKey(id)) {
      Runtime.trap("Student not found");
    };
    students.remove(id);
  };

  public query ({ caller }) func searchStudents(
    nameFilter : ?Text,
    mobileFilter : ?Text,
  ) : async [Student] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search students");
    };
    var results = students.values().toArray();
    switch (nameFilter) {
      case (null) {};
      case (?filter) {
        results := results.filter(
          func(student) {
            student.name.toLower().contains(#text(filter.toLower()));
          }
        );
      };
    };
    switch (mobileFilter) {
      case (null) {};
      case (?filter) {
        results := results.filter(
          func(student) {
            student.mobileNumber.toLower().contains(#text(filter.toLower()));
          }
        );
      };
    };
    results;
  };

  // Attendance CRUD
  public shared ({ caller }) func recordAttendance(
    studentId : Text,
    date : Text,
    status : AttendanceStatus,
    note : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record attendance");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    let id = studentId # date;
    let attendance : Attendance = {
      id;
      studentId;
      date;
      status;
      note;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    attendanceRecords.add(id, attendance);
    id;
  };

  public shared ({ caller }) func updateAttendance(
    id : Text,
    status : AttendanceStatus,
    note : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update attendance");
    };
    let existing = switch (attendanceRecords.get(id)) {
      case (null) { Runtime.trap("Attendance record not found") };
      case (?attendance) { attendance };
    };
    let updated : Attendance = {
      id;
      studentId = existing.studentId;
      date = existing.date;
      status;
      note;
      createdAt = existing.createdAt;
      updatedAt = Time.now();
    };
    attendanceRecords.add(id, updated);
  };

  public query ({ caller }) func getAttendanceRecordsByStudent(
    studentId : Text,
  ) : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance records");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    attendanceRecords.values().toArray().filter(
      func(record) { record.studentId == studentId }
    );
  };

  public query ({ caller }) func getAttendanceRecordsByDateRange(
    startDate : Text,
    endDate : Text,
  ) : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance records");
    };
    attendanceRecords.values().toArray().filter(
      func(record) { record.date >= startDate and record.date <= endDate }
    );
  };

  // Fees CRUD
  public shared ({ caller }) func recordFee(
    studentId : Text,
    date : Text,
    amount : Text,
    paymentMode : Text,
    note : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record fees");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    let id = studentId # date # Time.now().toText();
    let fee : Fee = {
      id;
      studentId;
      date;
      amount;
      paymentMode;
      note;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    feeRecords.add(id, fee);
    id;
  };

  public query ({ caller }) func getFeeRecordsByStudent(studentId : Text) : async [Fee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view fee records");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    feeRecords.values().toArray().filter(
      func(record) { record.studentId == studentId }
    );
  };

  // Monthly Test CRUD
  public shared ({ caller }) func recordMonthlyTest(
    studentId : Text,
    month : Text,
    subject : Text,
    marks : Text,
    remark : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record monthly tests");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    let id = studentId # month # subject;
    let test : MonthlyTest = {
      id;
      studentId;
      month;
      subject;
      marks;
      remark;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    monthlyTestRecords.add(id, test);
    id;
  };

  public query ({ caller }) func getMonthlyTestsByStudent(
    studentId : Text,
  ) : async [MonthlyTest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view monthly test records");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    monthlyTestRecords.values().toArray().filter(
      func(record) { record.studentId == studentId }
    );
  };

  // Exams CRUD
  public shared ({ caller }) func recordExam(
    studentId : Text,
    examName : Text,
    examDate : Text,
    subject : Text,
    marks : Text,
    remark : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record exams");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    let id = studentId # examName # examDate # subject;
    let exam : Exam = {
      id;
      studentId;
      examName;
      examDate;
      subject;
      marks;
      remark;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    examRecords.add(id, exam);
    id;
  };

  public query ({ caller }) func getExamsByStudent(studentId : Text) : async [Exam] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view exam records");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student not found");
    };
    examRecords.values().toArray().filter(
      func(record) { record.studentId == studentId }
    );
  };
};
