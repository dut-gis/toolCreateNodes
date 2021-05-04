https://dut-gis.github.io/toolCreateNodes/
DOCUMENT FOR DATA COLLECTOR
MODE:
    - normal: dùng để chấm các node bình thường
    - place: chấm các node dùng để hiển thị marker lên bản đồ. 
        Lưu ý: cần phải điền tên rồi mới được chấm
    - entranceBuilding: chấm lối vào của các khu. 
        Lưu ý: node này chỉ cần chấm ở tầng 1
    - building: chấm node thuộc building. Thường chấm ở các góc hoặc để nối các node
    - classroom: chấm node của phòng. Lưu ý: cần phải chọn đúng tên lớp, tick vào isMainEntrance nếu là cửa chính
        TIP: vì phần này cần chọn nhiều thứ nên khó thao tác => dùng phím tắt
            - phím "c": thay đổi trạng thái isMainEntrance (true hoặc false)
            - phím "w": tăng classId
            - phím "s": giam classId
    - stair: chấm cầu thang.
        Lưu ý: 
            - Chọn stairID trước khi chấm 
            - Chỗ đi lên thì chấm node có stairSequence = 0
            - Chỗ đi xuóng thì chấm node có stairSequence = 1
            - các node còn lại thì chấm theo đúng thứ tự
        TIP: stairSequence sẽ tự động tăng lên 1 khi chấm vì vậy chỉ cần chấm đúng theo thứ tự như trên không cần chọn stairSequence
THỨ TỰ THỰC HIỆN:
1. Đổi màu, kích thước node tùy ý
2. Click chuột lên map để tạo node
3. Click vào node bất kì để vẽ đường đi
4. Sau khi làm xong thì nhấn create file
5. Nhấn Download
TIPS FOR NODE: 
    - Ctrl+z để quay lại
    - Ctrl+x để xóa node đang được chọn
    - Shift đê bỏ chọn node
    - Xóa 1 path bất kì bằng cách vẽ đè 1 path lên
MERGE_NODE: CHỈ DÀNH CHO MASTER
Ví dụ: Có node khu H và khu E
    - Mở console tạo biến khuH, khuE lưu hai mảng node
    - gõ mergeNodes([khuH,khuE])
    - OKE
