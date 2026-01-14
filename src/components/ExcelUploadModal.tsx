import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export interface ParsedStudent {
  name: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  ageGroup: string;
}

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: ParsedStudent[]) => void;
}

const ExcelUploadModal = ({ isOpen, onClose, onImport }: ExcelUploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setParsedData([]);
    setErrors([]);
    setIsValidating(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const normalizeColumnName = (name: string): string => {
    const lower = name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    
    const mappings: Record<string, string> = {
      fullname: "name",
      studentname: "name",
      name: "name",
      email: "email",
      emailaddress: "email",
      phone: "phone",
      phonenumber: "phone",
      mobile: "phone",
      class: "class",
      classname: "class",
      grade: "class",
      section: "section",
      div: "section",
      division: "section",
      agegroup: "ageGroup",
      age: "ageGroup",
    };
    
    return mappings[lower] || lower;
  };

  const parseFile = async (file: File) => {
    setIsValidating(true);
    setErrors([]);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
      
      if (jsonData.length === 0) {
        setErrors(["File is empty or has no valid data"]);
        setIsValidating(false);
        return;
      }
      
      // Normalize column names
      const normalized = jsonData.map(row => {
        const newRow: Record<string, string> = {};
        Object.entries(row).forEach(([key, value]) => {
          newRow[normalizeColumnName(key)] = String(value || "").trim();
        });
        return newRow;
      });
      
      // Check required columns
      const firstRow = normalized[0];
      const requiredCols = ["name", "email", "class"];
      const missingCols = requiredCols.filter(col => !(col in firstRow));
      
      if (missingCols.length > 0) {
        setErrors([`Missing required columns: ${missingCols.join(", ")}. Required: Full Name, Email, Class`]);
        setIsValidating(false);
        return;
      }
      
      // Parse and validate each row
      const validationErrors: string[] = [];
      const students: ParsedStudent[] = normalized.map((row, index) => {
        const student: ParsedStudent = {
          name: row.name || "",
          email: row.email || "",
          phone: row.phone || "",
          class: row.class?.replace(/class\s*/i, "") || "",
          section: row.section || "A",
          ageGroup: row.ageGroup || "15-18",
        };
        
        // Validate
        if (!student.name) {
          validationErrors.push(`Row ${index + 2}: Missing name`);
        }
        if (!student.email) {
          validationErrors.push(`Row ${index + 2}: Missing email`);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
          validationErrors.push(`Row ${index + 2}: Invalid email format`);
        }
        if (!student.class) {
          validationErrors.push(`Row ${index + 2}: Missing class`);
        }
        
        return student;
      });
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors.slice(0, 5)); // Show first 5 errors
        if (validationErrors.length > 5) {
          setErrors(prev => [...prev, `...and ${validationErrors.length - 5} more errors`]);
        }
      }
      
      setParsedData(students);
      toast.success(`Parsed ${students.length} students from file`);
    } catch (error) {
      console.error("Parse error:", error);
      setErrors(["Failed to parse file. Please ensure it's a valid Excel or CSV file."]);
    }
    
    setIsValidating(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "xlsx" || ext === "xls" || ext === "csv") {
        parseFile(file);
      } else {
        toast.error("Please upload an Excel (.xlsx, .xls) or CSV file");
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleImport = () => {
    if (errors.length > 0) {
      toast.error("Please fix validation errors before importing");
      return;
    }
    onImport(parsedData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden glass-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="text-primary" />
            Upload Excel/CSV File
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragging 
                ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,245,212,0.3)]" 
                : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
              }
            `}
          >
            <Upload size={48} className={`mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-lg font-semibold mb-2">
              {isDragging ? "Drop file here!" : "Drop Excel/CSV here or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground">
              Supported: .xlsx, .csv | Required columns: Full Name, Email, Class
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Optional: Phone, Section, Age Group
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle size={20} />
                <span className="font-semibold">Validation Errors</span>
              </div>
              <ul className="text-sm text-destructive/80 space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle size={18} className="text-secondary" />
                  Preview ({parsedData.length} students)
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetState}
                  className="text-muted-foreground"
                >
                  <X size={16} className="mr-1" />
                  Clear
                </Button>
              </div>
              
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="max-h-60 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-primary">Full Name</TableHead>
                        <TableHead className="text-primary">Email</TableHead>
                        <TableHead className="text-primary">Phone</TableHead>
                        <TableHead className="text-primary">Class</TableHead>
                        <TableHead className="text-primary">Section</TableHead>
                        <TableHead className="text-primary">Age Group</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((student, i) => (
                        <TableRow key={i} className={i % 2 === 0 ? "bg-muted/10" : ""}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phone || "-"}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>
                            <span className="badge-neon text-xs">
                              {student.ageGroup === "15-18" ? "15-18 High School" : student.ageGroup}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {parsedData.length > 5 && (
                  <div className="text-center py-2 text-sm text-muted-foreground bg-muted/20">
                    ...and {parsedData.length - 5} more students
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border/30">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="neon"
              onClick={handleImport}
              disabled={parsedData.length === 0 || errors.length > 0 || isValidating}
              className="gap-2"
            >
              <CheckCircle size={18} />
              Validate & Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelUploadModal;
