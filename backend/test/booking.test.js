const Booking = require("../models/Booking");
const bookingController = require("../controllers/booking");
const { mockRequsetData } = require('./mockData');

jest.mock("../models/Booking");

describe("Booking API", () => {
    describe("get all booking requests", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should fetch all booking requests when the user has admin role", async () => {
            const req = { user: { name: "user A", role: "admin" } };
            const res = { status: jest.fn().mockReturnThis(), count: jest.fn(), json: jest.fn(), };

            Booking.find.mockResolvedValue(mockRequsetData);
            await bookingController.getRequests(req, res);

            expect(Booking.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 3, data: mockRequsetData });
        });

        it("should fetch all booking requests of a user when the user has user role", async () => {
            const req = { user: { name: "user A", role: "user" } };
            const res = { status: jest.fn().mockReturnThis(), count: jest.fn(), json: jest.fn(), };

            Booking.find.mockResolvedValue(mockRequsetData.slice(0, 2));
            await bookingController.getRequests(req, res);

            expect(Booking.find).toHaveBeenCalledWith({ userName: "user A" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 2, data: mockRequsetData.slice(0, 2) });
        });

        it("should return status 400 when an error occurs", async () => {
            const req = { user: { name: "user A", role: "admin" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.find.mockRejectedValue(new Error());
            await bookingController.getRequests(req, res);

            expect(Booking.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(Error) });
        });
    });

    describe("create a booking request", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should book successfully when there is no date overlap", async () => {
            const req = { body: { userName: "user A", campgroundId: "1", checkIn: "2025-10-23T17:00:00.000+00:00", checkOut: "2025-10-25T17:00:00.000+00:00" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.find.mockResolvedValue(mockRequsetData[0]);
            Booking.create.mockResolvedValue(req.body);
            await bookingController.createRequest(req, res);

            expect(Booking.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: req.body, msg: "Booking successful" });
        });

        it("should book successfully when there is no existing booking", async () => {
            const req = { body: { userName: "user C", campgroundId: "1", checkIn: "2025-10-23T17:00:00.000+00:00", checkOut: "2025-10-25T17:00:00.000+00:00" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.find.mockResolvedValue([]);
            Booking.create.mockResolvedValue(req.body);
            await bookingController.createRequest(req, res);

            expect(Booking.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: req.body, msg: "Booking successful" });
        });

        it("should fail the booking when the dates overlap with an existing booking", async () => {
            const req = { body: { userName: "user A", campgroundId: "1", checkIn: "2025-10-16T17:00:00.000+00:00", checkOut: "2025-10-17T17:00:00.000+00:00" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.find.mockResolvedValue(mockRequsetData.slice(0, 1));
            await bookingController.createRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: "Booking failed: Dates overlap with an existing booking" });
        });

        it("should return status 400 when an error occurs", async () => {
            const req = { body: { userName: "user A", campgroundId: "1", checkIn: "2025-10-16T17:00:00.000+00:00", checkOut: "2025-10-17T17:00:00.000+00:00" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.create.mockRejectedValue(new Error());
            await bookingController.createRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(Error) });
        });
    });

    describe("update a booking request", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should update successfully when the booking id exists ", async () => {
            const req = {
                params: { id: "1234" },
                body: { checkIn: "2025-10-17T17:00:00.000+00:00", checkOut: "2025-10-19T17:00:00.000+00:00" }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const updatedData = { ...mockRequsetData[0], checkIn: req.body.checkIn, checkOut: req.body.checkOut }

            Booking.findByIdAndUpdate.mockResolvedValue(updatedData);
            await bookingController.updateRequest(req, res);

            expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true, });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedData });
        });

        it("should fail the update when the booking id doesn't exist", async () => {
            const req = {
                params: { id: "123" },
                body: { checkIn: "2025-10-17T17:00:00.000+00:00", checkOut: "2025-10-19T17:00:00.000+00:00" }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.findByIdAndUpdate.mockResolvedValue(null)
            await bookingController.updateRequest(req, res);

            expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true, });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: "This booking request not found" });
        });

        it("should return status 400 when an error occurs", async () => {
            const req = {
                params: { id: "1234" },
                body: { checkIn: "2025-10-17T17:00:00.000+00:00", checkOut: "2025-10-19T17:00:00.000+00:00" }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.findByIdAndUpdate.mockRejectedValue(new Error());
            await bookingController.updateRequest(req, res);

            expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true, });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false });
        });
    });

    describe("delete a booking request", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should delete successfully when the booking id exists", async () => {
            const req = { params: { id: "1234" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.findByIdAndDelete.mockResolvedValue(mockRequsetData.slice(1, 3))
            await bookingController.deleteRequest(req, res);

            expect(Booking.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRequsetData.slice(1, 3) });
        });

        it("should fail the delete when the booking id doesn't exist", async () => {
            const req = { params: { id: "124" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.findByIdAndDelete.mockResolvedValue(null)
            await bookingController.deleteRequest(req, res);

            expect(Booking.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: "Booking request not found" });
        });

        it("should return status 400 when an error occurs", async () => {
            const req = { params: { id: "1234" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };

            Booking.findByIdAndDelete.mockRejectedValue(new Error());
            await bookingController.deleteRequest(req, res);

            expect(Booking.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(Error) });
        });
    });


});
