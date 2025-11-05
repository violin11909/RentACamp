const Campground = require("../models/Campground");
const campgroundController = require("../controllers/campgrounds");

jest.mock("../models/Campground");

describe("Campground API", () => {

    describe("get all campgrounds", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return all campgrounds when campgrounds exist", async () => {
            const mockData = [{ _id: "1234", name: "campground A" }, { _id: "1235", name: "campground B" }];

            const req = jest.fn();
            const res = { status: jest.fn().mockReturnThis(), count: jest.fn(), json: jest.fn(), };
            const next = jest.fn();

            Campground.find.mockResolvedValue(mockData);
            await campgroundController.getCampgrounds(req, res, next);

            expect(Campground.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: mockData.length, data: mockData });
        });

        it("should return an empty array when no campgrounds exist", async () => {
            const mockData = [];

            const req = jest.fn();
            const res = { status: jest.fn().mockReturnThis(), count: jest.fn(), json: jest.fn(), };
            // jest.fn().mockReturnThis() ใช้กับ Express response ที่ต้อง chain เช่น res.status().json()
            //toEqual: ใช้สำหรับ เปรียบเทียบค่า
            //toHaveBeenCalledWith: ใช้สำหรับ ตรวจสอบฟังก์ชันจำลอง(jest.fn()) ว่า "ถูกเรียกใช้งาน" ด้วย "อาร์กิวเมนต์" (Argument) ที่ระบุหรือไม่
            // 2. expect(A).toHaveBeenCalledWith(B)
            // Matcher นี้ใช้กับฟังก์ชันจำลอง (Mock Function) เท่านั้น เพื่อตรวจสอบ "พฤติกรรม" ของมัน
            // ฟังก์ชัน A ถูกเรียกใช้ (was called) หรือไม่?
            // ถ้าถูกเรียกใช้, มันถูกเรียกใช้โดยมี อาร์กิวเมนต์ เป็น B ใช่หรือไม่?
            // คุณสร้าง res.json ให้เป็น "สายลับ" (jest.fn()) ที่คอยดักฟังว่า Controller ของคุณจะเรียกใช้งานมันหรือไม่ และเรียกด้วยข้อมูลอะไร
            const next = jest.fn();

            Campground.find.mockResolvedValue(mockData);
            await campgroundController.getCampgrounds(req, res, next);

            expect(Campground.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: mockData.length, data: mockData });
        });

        it("should return status 400 when an error occurs", async () => {

            const req = jest.fn();
            const res = { status: jest.fn().mockReturnThis(), count: jest.fn(), json: jest.fn(), };
            const next = jest.fn();

            Campground.find.mockRejectedValue(new Error());
            await campgroundController.getCampgrounds(req, res, next);

            expect(Campground.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(Error) });
        });
    });

    describe("get one campground", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return a campground when found by Id", async () => {
            const mockData = { _id: "1234", name: "campground A" };
            const req = { params: { id: "1234" }, };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findById.mockResolvedValue(mockData);
            await campgroundController.getCampground(req, res, next);

            expect(Campground.findById).toHaveBeenCalledWith("1234");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockData });

        });

        it("should return status 404 when campgorund Id does not exist", async () => {
            const mockData = { _id: "1234", name: "campground A" };

            const req = { params: { id: "123" }, };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findById.mockResolvedValue(null);
            await campgroundController.getCampground(req, res, next);

            expect(Campground.findById).toHaveBeenCalledWith("123");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false
            }));
        });

        it("should return status 500 when an error occurs", async () => {
            const req = { params: { id: "1234" }, };
            const res = { status: jest.fn().mockReturnThis(), count: jest.fn(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findById.mockRejectedValue(new Error());
            await campgroundController.getCampground(req, res, next);

            expect(Campground.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(String) });
        });
    });

    //Find By Email
    describe("create a campground", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return a created campground when capmground create sucesssfully", async () => {
            const req = { body: { _id: "1234", name: "new campground" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.create.mockResolvedValue(req.body);
            await campgroundController.createCampground(req, res, next);

            expect(Campground.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: req.body });
        });

        it("should return status 400 when campgorund data is invalid", async () => {

            const req = { body: { _id: "1234", name: 123 } }; //name should be string
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.create.mockRejectedValue(new Error())
            //RejectedValue error เพื่อให้มัน “throw error” จริง ๆ เข้า catch block
            await campgroundController.createCampground(req, res, next);

            expect(Campground.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(Error) });
            // expect.any(Error()) → ❌ ผิด เพราะ Error() คือ object
            // expect.any(Error) → ✅ ถูก เพราะ Error คือ class constructor
        });

        it("should return status 400 when an error occurs", async () => {
            const req = { body: { _id: "1234", name: "new campground" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.create.mockRejectedValue(new Error());
            await campgroundController.createCampground(req, res, next);

            expect(Campground.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: expect.any(Error) });
        });
    });

    describe("update a campground", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return a updated campground when capmground id exists and update sucesssfully", async () => {
            const mockOldData = { _id: "1234", name: "campground A" };
            const mockNewData = { _id: "1234", name: "campground B" };

            const req = { params: { id: "1234" }, body: { name: "campground B" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findByIdAndUpdate.mockResolvedValue(mockNewData)
            await campgroundController.updateCampground(req, res, next);

            expect(Campground.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true, });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockNewData });
        });

        it("should return status 400 when capmground id doesn't exists", async () => {
            const mockData = { _id: "1234", name: "campground A" };

            const req = { params: { id: "123" }, body: { name: "campground B" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findByIdAndUpdate.mockResolvedValue(null)
            await campgroundController.updateCampground(req, res, next);

            expect(Campground.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true, });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false });
        });

        it("should return status 400 when an error occurs", async () => {
            const req = { params: { id: "123" }, body: { name: "campground B" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findByIdAndUpdate.mockRejectedValue(new Error());
            await campgroundController.updateCampground(req, res, next);

            expect(Campground.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true, });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false });
        });
    });

    describe("delete a campground", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return a deleted campground when capmground id exists and delete sucesssfully", async () => {
            const mockData = { _id: "1234", name: "campground A" };

            const req = { params: { id: "1234" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findByIdAndDelete.mockResolvedValue(mockData)
            await campgroundController.deleteCampground(req, res, next);

            expect(Campground.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockData });
        });

        it("should return status 400 when capmground id doesn't exists", async () => {
            const mockData = { _id: "1234", name: "campground A" };

            const req = { params: { id: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findByIdAndDelete.mockResolvedValue(null)
            await campgroundController.deleteCampground(req, res, next);

            expect(Campground.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false });
        });

        it("should return status 400 when an error occurs", async () => {
            const req = { params: { id: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), };
            const next = jest.fn();

            Campground.findByIdAndDelete.mockRejectedValue(new Error());
            await campgroundController.deleteCampground(req, res, next);

            expect(Campground.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false });
        });
    });


});
