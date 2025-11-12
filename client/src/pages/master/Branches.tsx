 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/client/src/pages/master/BranchesPage.tsx b/client/src/pages/master/BranchesPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..d16dbb5d5368ced661c2116411e9eb92720cb818
--- /dev/null
+++ b/client/src/pages/master/BranchesPage.tsx
@@ -0,0 +1,84 @@
+import { Plus } from "lucide-react";
+
+import { Button } from "@/components/ui/button";
+import {
+  Table,
+  TableBody,
+  TableCell,
+  TableHead,
+  TableHeader,
+  TableRow,
+} from "@/components/ui/table";
+
+const mockBranches = [
+  {
+    id: "BR-001",
+    name: "فرع الرياض",
+    address: "شارع العليا، الرياض، المملكة العربية السعودية",
+    phone: "+966 11 123 4567",
+  },
+  {
+    id: "BR-002",
+    name: "فرع جدة",
+    address: "حي الروضة، جدة، المملكة العربية السعودية",
+    phone: "+966 12 234 5678",
+  },
+  {
+    id: "BR-003",
+    name: "فرع الدمام",
+    address: "طريق الخليج، الدمام، المملكة العربية السعودية",
+    phone: "+966 13 345 6789",
+  },
+];
+
+export default function BranchesPage() {
+  return (
+    <div className="space-y-6">
+      <div className="flex flex-row-reverse items-center justify-between gap-4">
+        <Button className="gap-2" size="lg">
+          <Plus className="h-4 w-4" />
+          إضافة فرع جديد
+        </Button>
+        <h1 className="text-3xl font-bold text-right flex-1">إدارة الفروع</h1>
+      </div>
+
+      <div className="rounded-md border">
+        <Table>
+          <TableHeader>
+            <TableRow>
+              <TableHead className="text-right">اسم الفرع</TableHead>
+              <TableHead className="text-right">عنوان الفرع</TableHead>
+              <TableHead className="text-right">رقم الهاتف</TableHead>
+              <TableHead className="text-right">إجراءات</TableHead>
+            </TableRow>
+          </TableHeader>
+          <TableBody>
+            {mockBranches.map((branch) => (
+              <TableRow key={branch.id}>
+                <TableCell className="font-medium text-right" data-testid={`branch-name-${branch.id}`}>
+                  {branch.name}
+                </TableCell>
+                <TableCell className="text-right" data-testid={`branch-address-${branch.id}`}>
+                  {branch.address}
+                </TableCell>
+                <TableCell className="text-right" data-testid={`branch-phone-${branch.id}`}>
+                  {branch.phone}
+                </TableCell>
+                <TableCell>
+                  <div className="flex justify-end gap-2">
+                    <Button variant="outline" size="sm">
+                      تعديل
+                    </Button>
+                    <Button variant="ghost" size="sm" className="text-destructive">
+                      حذف
+                    </Button>
+                  </div>
+                </TableCell>
+              </TableRow>
+            ))}
+          </TableBody>
+        </Table>
+      </div>
+    </div>
+  );
+}
 
EOF
)
